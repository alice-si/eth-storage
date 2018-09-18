var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');
const ethUtil = require('ethereumjs-util');
var PREFIX = require('./dbPrefixes');

// StateDB.prototype.
module.exports = StateDB;

/**
 * @class StateDB
 * @param {String} databasePath
 * @param stats, turn on statistics and logging
 */
function StateDB(databasePath,stats=false) {
    var self = this;
    if (databasePath !== undefined) {
        self.db = levelup(leveldown(databasePath));
    }
    self.stats = stats;
}

StateDB.prototype.free = function () {
    var self = this;
    self.db.close();
};

/**
 * converts to hex buffer
 * @method blockNumberByHash
 * @param val
 * @returns hex buffer
 */
StateDB.prototype.bufferHex = function (val) {
    if (val instanceof Buffer) {
        return val
    }
    if (typeof val === 'string' && val.length > 2 && val.slice(0, 2) === '0x') {
        val = val.slice(2, val.length);
    }
    return new Buffer(val, 'hex');
};

/**
 * converts buffer to int
 * @method bufferToInt
 * @param val
 * @returns int
 */
StateDB.prototype.bufferToInt = function (val) {
    if (val instanceof Buffer) {
        return parseInt('0x' + val.toString('hex'));
    }
    return parseInt(val);
};

/**
 * converts buffer to string
 * @method bufferToString
 * @param val
 * @returns string
 */
StateDB.prototype.bufferToString = function (val) {
    if (val instanceof Buffer) {
        return val.toString('hex');
    }
    return val
};

/**
 * converts to 64 bits buffer
 * @method blockNumberByHash
 * @param val
 * @returns 64 bits buffer
 */
StateDB.prototype.buffer64 = function (val) {
    if (val instanceof Buffer) {
        return val
    }
    var buf = new Buffer(8);
    buf.writeUInt32BE(parseInt(val), 4);
    return buf;
};

/**
 * converts to 256 bits buffer
 * @method blockNumberByHash
 * @param val
 * @returns 256 bits buffer
 */
StateDB.prototype.buffer256 = function (val) {
    var self = this;
    if (val instanceof Buffer) {
        if (val.length <= 32) {
            var str = val.toString('hex');
            while (str.length < 64) {
                str = '0' + str;
            }
            return self.bufferHex(str)
        }
        return val
    }
    var buf = new Buffer(32);
    buf.writeUInt32BE(parseInt(val), 28);
    return buf;
};

/**
 * SHA3
 * @method sha3
 */
StateDB.prototype.sha3 = ethUtil.sha3;

/**
 * returns hash for value at index at structure
 * @method atStruct
 * @param struct
 * @param {Number} index
 * @returns 256 bits buffer
 */
StateDB.prototype.atStruct = function (struct, index) {
    var self = this;
    struct = self.buffer256(struct);
    index = parseInt(index);
    var structKey = self.sha3(struct);
    var end = structKey.readInt32BE(28);
    end += index;
    structKey.writeInt32BE(end, 28);
    return structKey;
};

/**
 * returns hash for value at index at structure
 * @method atMap
 * @param map
 * @param key
 * @returns 256 bits buffer
 */
StateDB.prototype.atMap = function (map, key) {
    var self = this;
    map = self.buffer256(map);
    key = self.buffer256(key);
    return self.sha3(self.bufferHex(key.toString('hex') + map.toString('hex')));
};

/**
 * Decodes rlp encoding
 * @method decode
 */
StateDB.prototype.decode = rlp.decode;

/**
 * gets number of block
 * @method blockNumberByHash
 * @param blockHash
 * @param {Function} cb the callback
 */
StateDB.prototype.blockNumberByHash = function (blockHash, cb) {
    var self = this;
    blockHash = self.bufferHex(blockHash);
    var query = Buffer.concat([PREFIX.headerNumberPrefix, blockHash]);
    self.db.get(query, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        cb(err, val);
    });
};

/**
 * gets hash of block
 * @method blockHash
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHash = function (blockNumber, cb) {
    var self = this;
    blockNumber = self.bufferHex(blockNumber);
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
        val = rlp.decode(val);
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
 * gets header of block
 * @method blockHeader
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHeader = function (blockNumber, cb) {
    var self = this;
    blockNumber = self.buffer64(blockNumber);
    self.blockHash(blockNumber, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockHeader(blockNumber, val, cb);
    });
};

StateDB.prototype._blockBody = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([PREFIX.blockBodyPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }

        var decoded = rlp.decode(val);
        var body = {
            transactionList: decoded[0],
            ommersList: decoded[1]
        };
        cb(err, body);
    });
};

/**
 * gets body of block
 * @method getBody
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockBody = function (blockNumber, cb) {
    var self = this;
    blockNumber = self.buffer64(blockNumber);
    self.blockHash(blockNumber, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockBody(blockNumber, val, cb);
    });
};

/**
 * gets header of block
 * @method blockHeaderByHash
 * @param blockHash
 * @param {Function} cb the callback
 */
StateDB.prototype.blockHeaderByHash = function (blockHash, cb) {
    var self = this;
    blockHash = self.bufferHex(blockHash);
    self.blockNumberByHash(blockHash, function (err, val) {
        if (err != null) {
            cb(err, val);
            return;
        }
        self._blockHeader(val, blockHash, cb);
    });
};

/**
 * gets state root of block
 * @method blockStateRoot
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.blockStateRoot = function (blockNumber, cb) {
    var self = this;
    blockNumber = self.buffer64(blockNumber);
    self.blockHeader(blockNumber, function (err, header) {
        if (err != null) {
            cb(err, header);
            return;
        }
        cb(err, header.stateRoot);
    })
};

/**
 * Decodes node path
 * @method compactToHex
 * @param base
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
 * gets node given hash
 * @method getVariablePath
 * @param hash
 * @param cb
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 */
StateDB.prototype.getNode = function (hash, cb) {
    var self = this;
    hash = self.bufferHex(hash);
    self.db.get(hash, {valueEncoding: "binary", keyEncoding: "binary"}, function (err, val) {
        var decoded = rlp.decode(val);
        if (decoded === undefined || decoded[0] === undefined) {
            cb(new Error('missing key in tree'), null);
        }
        else if (decoded.length === 17) {
            var node = {
                type: 'branch',
                value: decoded[16].length === 0 ? decoded[16] : self.rlp(decoded[16]),
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
                    value: self.decode(decoded[1])
                };
                cb(null, node)
            }
        }
    })
};
