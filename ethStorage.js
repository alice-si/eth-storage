var HashSet = require('hashset');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');
const ethUtil = require('ethereumjs-util');
const assert = require("assert");

var databaseVerisionKey = new Buffer("DatabaseVersion"); // databaseVerisionKey tracks the current database version.
var headHeaderKey = new Buffer("LastHeader"); // headHeaderKey tracks the latest know header's hash.
var headBlockKey = new Buffer("LastBlock"); // headBlockKey tracks the latest know full block's hash.
var headFastBlockKey = new Buffer("LastFast"); // headFastBlockKey tracks the latest known incomplete block's hash duirng fast sync.
var fastTrieProgressKey = new Buffer("TrieSync"); // fastTrieProgressKey tracks the number of trie entries imported during fast sync.

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
var BloomBitsIndexPrefix = new Buffer("iB"); // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress // Chain index prefixes (use `i` + single byte to avoid mixing data types).

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
    blockHash = self.bufferHex(blockHash);
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
    blockNumber = self.bufferHex(blockNumber);
    query = Buffer.concat([headerPrefix, blockNumber, headerHashSuffix]);
    self.db.get(query, function (err, val) {
        cb(err, val);
    })
};

StateDB.prototype._blockHeader = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([headerPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, function (err, val) {
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
        self._blockHeader(blockNumber, val, cb);
    });
};

StateDB.prototype._blockBody = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([blockBodyPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, function (err, val) {
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
        cb(err, header.stateRoot);
    })
};

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
    self.db.get(hash, function (err, val) {
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

StateDB.prototype._sfind = function (rootHash, key, pos, prevMap, helpMap, cb) {
    var self = this;
    if (prevMap.contains(rootHash.toString('hex'))) {
        cb(null, null, prevMap, helpMap); // value didn`t change, retun new stack
    }
    else {

        prevMap.add(rootHash.toString('hex')); // add to map
        helpMap.add(rootHash.toString('hex')); // add to map

        self.getNode(rootHash, function (err, node) {
            if (node === null) {
                cb(err, node, prevMap, helpMap);
            }
            else if (node.type === 'branch') {
                var _pos = Math.floor(pos / 2);
                var next = (pos % 2 === 0) ? Math.floor(key[_pos] / 16) : key[_pos] % 16;
                self._sfind(node.children[next], key, pos + 1, prevMap, helpMap, cb)
            }
            else {
                var keyString = key.toString('hex');
                if (node.path === keyString.slice(pos, pos + node.path.length)) {
                    if (node.type === 'extension' && pos + node.path.length < keyString.length) {
                        self._sfind(node.child, key, pos + node.path.length, prevMap, helpMap, cb)
                    }
                    else if (node.type === 'leaf' && pos + node.path.length === keyString.length) {
                        cb(err, node.value, prevMap, helpMap); // value found
                    }
                }
                else {
                    cb(new Error('missing key in tree'), null, prevMap, helpMap);
                }
            }
        })


    }
};

/**
 * finds value in tree, knowing expected path
 * @method sfind
 * @param {String|Buffer} rootHash
 * @param {String|Buffer} key
 * @param {Function} cb the callback
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - stackPos - stack of position in key of nodes on path
 *  - stack - stack of hashes of nodes on path
 */
StateDB.prototype.sfind = function (rootHash, key, cb) {
    var self = this;
    rootHash = self.bufferHex(rootHash);
    key = self.bufferHex(key);
    self._sfind(rootHash, key, 0, new HashSet(), new HashSet(), cb);
};

StateDB.prototype.findNextBlock = function (adress, startBlockNumber, endBlockNumber, cb) {
    var self = this;
    adress = self.bufferHex(adress);
    startBlockNumber = self.bufferToInt(startBlockNumber);
    endBlockNumber = self.bufferToInt(endBlockNumber);

    if (startBlockNumber < endBlockNumber) {
        self.blockBody(startBlockNumber, function (err, body) {
            var i;
            for (i = 0; i < body.transactionList.length; i++) {
                var to = body.transactionList[i][3].toString('hex');
                if (to === adress.toString('hex') || to === '') { // TODO ?? .toString('hex'), TODO contract creation
                    cb(null, startBlockNumber);
                    break;
                }
            }
            if (i === body.transactionList.length) {
                self.findNextBlock(adress, startBlockNumber + 1, endBlockNumber, cb)
            }

        })
    }
    else {
        //TODO error not found
        cb(null, endBlockNumber);
    }
};

StateDB.prototype._getRange = function (adress, startBlockNumber, endBlockNumber, index, array, map, cb) {
    var self = this;
    if (startBlockNumber < endBlockNumber) {
        self.findNextBlock(adress, startBlockNumber + 1, endBlockNumber, function (err, next) {
            self.blockStateRoot(startBlockNumber, function (err, stateRoot) { // find account
                self._sfind(stateRoot, self.sha3(adress), 0, map, new HashSet(), function (err, node, map, helpMap) {
                    if (node === null) { // account didn`t changed
                        if (array.length === 0 || (err !== null && array[array.length - 1].val !== 'contract not found')) {
                            array.push({block: startBlockNumber, val: 'contract not found'});
                        }
                        self._getRange(adress, next, endBlockNumber, index, array, map, cb);
                    }
                    else {
                        self._sfind(node[2], self.sha3(index), 0, map, helpMap, function (err, val, helpMap) {
                            if (val !== null){
                                array.push({block: startBlockNumber, val: val});
                                self._getRange(adress, next, endBlockNumber, index, array, helpMap, cb);
                            }
                            else{
                                if (array.length === 0 || (err !== null && array[array.length - 1].val !== 'uninitialised')) {
                                    array.push({block: startBlockNumber, val: 'uninitialised'});
                                    self._getRange(adress, next, endBlockNumber, index, array, helpMap, cb);
                                }
                                else {
                                    self._getRange(adress, next, endBlockNumber, index, array, map, cb);
                                }

                            }
                        });
                    }

                })

            });

        });
    }
    else {
        cb(null, array);
    }
};

/**
 * gets variable states in block range, only first block and blocks where value changed
 * @method getRange
 * @param {String|Buffer} adress
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param {Function} cb the callback
 */
StateDB.prototype.getRange = function (adress, index, startBlockNumber, endBlockNumber, cb) {
    var self = this;
    adress = self.bufferHex(adress);
    startBlockNumber = self.buffer64(startBlockNumber);
    endBlockNumber = self.buffer64(endBlockNumber);
    startBlockNumber = self.bufferToInt(startBlockNumber);
    endBlockNumber = self.bufferToInt(endBlockNumber);
    index = self.buffer256(index);
    self._getRange(adress, startBlockNumber, endBlockNumber, index, [], new HashSet(), cb);
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

    var start = self.bufferToInt(startBlockNumber);
    var end = self.bufferToInt(endBlockNumber);
    var length = end - start;
    var workLength = length + (length % n === 0 ? 0 : (n - length % n));
    var period = Math.floor(workLength / n);
    var realN = Math.ceil(length / period);

    var result = new Array(realN);
    var ended = 0;

    var removeDuplicates = function () {
        var array = result[0];
        for (var i = 1; i < realN; i++) {
            if (result[i].length > 0) {
                if (array[array.length - 1]['val'].toString() === result[i][0]['val'].toString()) {
                    result[i] = result[i].splice(1, result[i].length - 1)
                }
                array = array.concat(result[i]);
            }
        }
        return array;
    };

    var newCb = function (i) {
        return function (err, val) {
            result[i] = val;
            ended++;
            if (ended === realN) {
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        self.getRange(adress, index, _start, _end, newCb(i));
    }
    self.getRange(adress, index, start + workLength - period, end, newCb(realN - 1));

};

