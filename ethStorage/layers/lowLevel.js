var levelup = require('levelup');
var leveldown = require('leveldown');
var PREFIX = require('../format/dbPrefixes');
var FORMATTER = require('../format/formatter');
var StatsCollector = require('../collectors/statsCollectors');

/**
 * This module is the lowest layer,
 * connects to database and gives getters
 * for direct access data from database:
 * block numbers, hashes, headers, bodys, state root
 * and simple nodes of merkle patricia trees by their hashes
 * @module lowLevel
 * @type {StateDB}
 */
module.exports = StateDB;

/**
 * Constructor
 * @class StateDB
 * @param {String} databasePath
 * @param {boolean} stats, turn on statistics and logging
 */
function StateDB(databasePath,stats=false) {
    var self = this;
    if (databasePath !== undefined) {
        self.connect(databasePath)
    }
    self.statsCollector = new StatsCollector(stats);
}

/**
 * opens connection to database
 * @method connect
 * @param {String} databasePath
 */
StateDB.prototype.connect = function (databasePath) {
    var self = this;
    self.db = levelup(leveldown(databasePath));
};

/**
 * closes connection to database
 * @method free
 */
StateDB.prototype.free = function () {
    var self = this;
    self.db.close();
};


/**
 * gets number of block by its hash
 * @method blockNumberByHash
 * @param {string|Buffer} blockHash
 * @param {Function} cb the callback
 */
StateDB.prototype.blockNumberByHash = function (blockHash, cb) {
    var self = this;
    blockHash = FORMATTER.bufferHex(blockHash);
    var query = Buffer.concat([PREFIX.headerNumberPrefix, blockHash]);
    self.db.get(query, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        cb(err, val);
    });
};

/**
 * gets hash of block its number
 * @method blockHashByNumber
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHashByNumber = function (blockNumber, cb) {
    var self = this;
    blockNumber = FORMATTER.buffer64(blockNumber);
    query = Buffer.concat([PREFIX.headerPrefix, blockNumber, PREFIX.headerHashSuffix]);
    self.db.get(query, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        cb(err, val);
    })
};

StateDB.prototype._blockHeader = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([PREFIX.headerPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        val = FORMATTER.rlpDecode(val);
        var header = {
            parentHash: val[0],
            ommersHash: val[1],
            beneficiary: val[2],
            stateRoot: val[3],
            transactionsRoot: val[4],
            receiptRoot: val[5],
            logsBloom: val[6],
            difficulty: val[7],
            number: val[8],
            gasLimit: val[9],
            gasUsed: val[10],
            timestamp: val[11],
            extraData: val[12],
            mixHash: val[13],
            nonce: val[14],
        };
        cb(err, header);
    })
};

/**
 * gets header of block by its number
 * @method blockHeader
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHeader = function (blockNumber, cb) {
    var self = this;
    blockNumber = FORMATTER.buffer64(blockNumber);
    self.blockHashByNumber(blockNumber, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockHeader(blockNumber, val, cb);
    });
};
/**
 * gets body of block by its number
 * @method blockBody
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockBody = function (blockNumber, cb) {
    var self = this;
    blockNumber = FORMATTER.buffer64(blockNumber);
    self.blockHashByNumber(blockNumber, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockBody(blockNumber, val, cb);
    });
};

/**
 * gets header of block by its hash
 * @method blockHeaderByHash
 * @param {string|Buffer} blockHash
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHeaderByHash = function (blockHash, cb) {
    var self = this;
    blockHash = FORMATTER.bufferHex(blockHash);
    self.blockNumberByHash(blockHash, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockHeader(val, blockHash, cb);
    });
};

/**
 * gets state root of block by its number
 * @method blockStateRoot
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockStateRoot = function (blockNumber, cb) {
    var self = this;
    blockNumber = FORMATTER.buffer64(blockNumber);
    self.blockHeader(blockNumber, function (err, header) {
        if (err != null) {
            cb(err, header);
            return;
        }
        cb(err, header.stateRoot);
    })
};

/**
 * Decodes path saved in merkle patricia tree nodes
 * of type leaf and extension
 * @method compactToHex
 * @param {Buffer} base
 */
StateDB.prototype.compactToHex = function (base) {
    var baseNibble = Math.floor(base[0] / 16); // first nible of base
    base = base.toString('hex');
    // delete terminator flag
    if (baseNibble < 2) {
        base = base.slice(0, base.length - 1);
    }
    // apply odd flag
    var chop = 2 - baseNibble % 2;
    return base.slice(chop, base.length);
};

/**
 * gets merkle patricia tree node given its hash
 * @method getNode
 * @param {string|Buffer} hash
 * @param cb
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 */
StateDB.prototype.getNode = function (hash, cb) {
    var self = this;
    hash = FORMATTER.bufferHex(hash);
    self.db.get(hash, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        var decoded = FORMATTER.rlpDecode(val);
        if (decoded === undefined || decoded[0] === undefined) {
            cb(new Error('missing key in tree'), null);
        }
        else if (decoded.length === 17) {
            var node = {
                type: 'branch',
                value: decoded[16].length === 0 ? decoded[16] : FORMATTER.rlpDecode(decoded[16]),
                children: decoded.splice(0, 16)
            };
            cb(null, node)
        }
        else {
            var baseNibble = Math.floor(decoded[0][0] / 16); // (bad way or) first nible of base
            var nodePath = self.compactToHex(decoded[0]);
            if (baseNibble < 2) {
                var node = {
                    type: 'extension',
                    path: nodePath,
                    child: decoded[1]
                };
                cb(null, node)
            }
            else if (baseNibble < 4) {
                var node = {
                    type: 'leaf',
                    path: nodePath,
                    value: FORMATTER.rlpDecode(decoded[1])
                };
                cb(null, node)
            }
        }
    })
};

StateDB.prototype._blockBody = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([PREFIX.blockBodyPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }

        var decoded = FORMATTER.rlpDecode(val);
        var body = {
            transactionList: decoded[0],
            ommersList: decoded[1]
        };
        cb(err, body);
    });
};

/**
 * gets hash of latest block
 * @method latestHeaderHash
 * @param {Function} cb the callback
 */
StateDB.prototype.latestHeaderHash = function (cb) {
    var self = this;
    query = Buffer.concat([PREFIX.headBlockKey]);
    self.db.get(query, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        cb(err, val);
    })
};

/**
 * gets number of latest block
 * @method blockHashByNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.latestHeaderNumber = function (cb) {
    var self = this;
    self.latestHeaderHash((err,hash) => {
        self.blockHeaderByHash(hash,(err,header) => {
            cb(err,FORMATTER.bufferToInt(header.number))
        })
    })
};
