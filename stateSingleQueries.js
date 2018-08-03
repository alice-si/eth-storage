var Trie = require('../merkle-patricia-tree');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');
const ethUtil = require('ethereumjs-util');

// databaseVerisionKey tracks the current database version.
var databaseVerisionKey = new Buffer("DatabaseVersion");

// headHeaderKey tracks the latest know header's hash.
var headHeaderKey = new Buffer("LastHeader");

// headBlockKey tracks the latest know full block's hash.
var headBlockKey = new Buffer("LastBlock");

// headFastBlockKey tracks the latest known incomplete block's hash duirng fast sync.
var headFastBlockKey = new Buffer("LastFast");

// fastTrieProgressKey tracks the number of trie entries imported during fast sync.
var fastTrieProgressKey = new Buffer("TrieSync");

// Data item prefixes (use single byte to avoid mixing data types, avoid `i`, used for indexes).
var headerPrefix = new Buffer("h"); // headerPrefix + num (uint64 big endian) + hash -> header
var headerTDSuffix = new Buffer("t"); // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td
var headerHashSuffix = new Buffer("n"); // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
var headerNumberPrefix = new Buffer("H"); // headerNumberPrefix + hash -> num (uint64 big endian)

var blockBodyPrefix = new Buffer("b"); // blockBodyPrefix + num (uint64 big endian) + hash -> block body
var blockReceiptsPrefix = new Buffer("r"); // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts

var txLookupPrefix = new Buffer("l"); // txLookupPrefix + hash -> transaction/receipt lookup metadata
var bloomBitsPrefix = new Buffer("B"); // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits

var preimagePrefix = new Buffer("secure-key-");      // preimagePrefix + hash -> preimage
var configPrefix = new Buffer("ethereum-config-"); // config prefix for the db

// Chain index prefixes (use `i` + single byte to avoid mixing data types).
var BloomBitsIndexPrefix = new Buffer("iB"); // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress

// StateDB.prototype.
module.exports = StateDB;

/**
 * @class StateDB
 * @param {String} databasePath
 */
function StateDB(databasePath) {
    if (databasePath !== undefined) {
        this.db = levelup(leveldown(databasePath));
    }
}

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
    return new Buffer(val, 'hex');
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
            var str = val.toString('hex')
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
    end += index; //TODO
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
    var query = Buffer.concat([headerNumberPrefix, blockHash]);
    self.db.get(query, function (err, val) {
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
    query = Buffer.concat([headerPrefix, blockNumber, headerHashSuffix]);
    self.db.get(query, function (err, val) {
        cb(err, val);
    })
};

StateDB.prototype._blockHeader = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([headerPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, function (err, val) {
        var decoded = rlp.decode(val);
        cb(err, decoded);
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
    self.blockHash(blockNumber, function (err, val) {
        self._blockHeader(blockNumber, val, cb);
    });
};

StateDB.prototype._blockBody = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([blockBodyPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, function (err, val) {
        var decoded = rlp.decode(val);
        cb(err, decoded);
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
    self.blockHash(blockNumber, function (err, val) {
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
    self.blockNumberByHash(blockHash, function (err, val) {
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
    self.blockHeader(blockNumber, function (err, val) {
        cb(err, val[3]);
    })
};

/**
 * finds value in tree given hash
 * @method find
 * @param {String|Buffer} rootHash
 * @param {String|Buffer} key (hashed)
 * @param {Function} cb the callback
 */
StateDB.prototype.find = function (rootHash, key, cb) {
    var self = this;
    rootHash = self.bufferHex(rootHash);
    // key = self.bufferHex(key); !
    trie = new Trie(self.db, rootHash);
    trie.get(key, function (err, val) {
        cb(err, rlp.decode(val));
    });
};

/**
 * gets storage tree of account
 * @method getStorage
 * @param {String|Buffer} adress
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.getStorage = function (adress, blockNumber, cb) {
    var self = this;
    adress = self.bufferHex(adress);
    blockNumber = self.buffer64(blockNumber);
    self.blockStateRoot(blockNumber, function (err, root) {
        var addressPath = self.sha3(adress);
        self.find(root, addressPath, cb);
    });
};

/**
 * gets variable state
 * @method getVariable
 * @param {String|Buffer} adress
 * @param {Number|Buffer} blockNumber
 * @param {Number|Buffer} index
 * @param {Function} cb the callback
 */
StateDB.prototype.getVariable = function (adress, index, blockNumber, cb) {
    var self = this;
    adress = self.bufferHex(adress);
    blockNumber = self.buffer64(blockNumber);
    index = self.buffer256(index);
    self.getStorage(adress, blockNumber, function (err, storage) {
        var hashedindex = self.sha3(index);
        self.find(storage[2], hashedindex, function (err, val) {
            cb(err, val);
        })
    });
};

/**
 * gets code of contract
 * @method getCode
 * @param {String|Buffer} adress
 * @param {Number|Buffer} blockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.getCode = function (adress, blockNumber, cb) {
    var self = this;
    adress = self.bufferHex(adress);
    blockNumber = self.buffer64(blockNumber);
    self.getStorage(adress, blockNumber, function (err, storage) {
        self.db.get(storage[3], cb);
    });
};

StateDB.prototype._getRange = function (adr, index, startBlock, endBlock, array, cb) {
    var self = this;
    if (startBlock < endBlock) {
        self.getVariable(adr,
            index, // index
            startBlock,
            function (err, val) {
                if (array.length > 0 && array.slice(-1)[0]['val'].toString('hex') === val.toString('hex')) ;
                else array.push({'block': startBlock, 'val': val});
                self._getRange(adr, index, startBlock + 1, endBlock, array, cb)
            })
    }
    else {
        cb(null, array);
    }
};

StateDB.prototype.getRange = function (adr, index, startBlock, endBlock, cb) {
    var self = this;
    index = self.buffer256(index);
    self._getRange(adr, index, startBlock, endBlock, [], cb);
};

/**
 * gets variable states in block range, only first block and blocks where value changed,
 * uses n parallel workes
 * @method getRangeMulti
 * @param {String|Buffer} adress
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param n number of pararrel functions
 * @param {Function} cb the callback
 */
StateDB.prototype.getRangeMulti = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2) {
    var self = this;
    adress = self.bufferHex(adress);
    startBlockNumber = self.buffer64(startBlockNumber);
    endBlockNumber = self.buffer64(endBlockNumber);
    index = self.buffer256(index);

    var start = parseInt('0x' + startBlockNumber.toString('hex'));
    var end = parseInt('0x' + endBlockNumber.toString('hex'));
    var length = end - start;
    var workLength = length + (length % n === 0 ? 0 : n - length % n);
    var period = Math.floor(workLength / n);

    // console.log('getRangeMulti,worklength,period:', workLength, period);

    var result = new Array(n);
    var ended = 0;

    var removeDuplicates = function () {
        var array = result[0];
        for (var i = 1; i < n; i++) {
            if (result[i].length > 0) {
                array.concat(array[array.length - 1]['val'] === result[i][0]['val'] ? result[i].splice(1, result[i].length - 1) : result[i])
            }
        }
        return array;
    };

    var newCb = function (i) {
        return function (err, val) {
            // console.log('ended is: ',ended,'val',val,'i',i);
            result[i] = val;
            ended++;
            if (ended === n) {
                // console.log(result);
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        self.getRange(adress, index, _start, _end, newCb(i));
    }
    self.getRange(adress, index, start + workLength - period, end, newCb(n - 1));


};

