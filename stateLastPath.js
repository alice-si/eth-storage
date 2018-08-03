var Trie = require('../merkle-patricia-tree');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');
const ethUtil = require('ethereumjs-util');
const assert = require("assert");

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
    if (databasePath !== undefined){
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
StateDB.prototype.getVariable = function (adress, blockNumber, index, cb) {
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
        cb(err, decoded);
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

StateDB.prototype._sfind = function (root, key, pos, posStack, nodeStack, cb) {
    var self = this;
    posStack.push(pos);
    nodeStack.push(root);
    self.getNode(root, function (err, decoded) {
        if (decoded.length === 17) {
            var _pos = Math.floor(pos / 2);
            var next = (pos % 2 === 0) ? Math.floor(key[_pos] / 16) : key[_pos] % 16;
            self._sfind(decoded[next], key, pos + 1, posStack, nodeStack, cb)
        }
        else if (decoded[0] === undefined) {
            cb(new Error('missing key in tree'), null, posStack, nodeStack);
        }
        else {
            var baseNibble = Math.floor(decoded[0][0] / 16); // (bad way or) first nible of base
            var nodePath = self.compactToHex(decoded[0]);
            var keyString = key.toString('hex');

            if (nodePath === keyString.slice(pos, pos + nodePath.length)) {
                if (baseNibble < 2 && pos + nodePath.length < keyString.length) {
                    self._sfind(decoded[1], key, pos + nodePath.length, posStack, nodeStack, cb)
                }
                else if (baseNibble < 4 && pos + nodePath.length === keyString.length) {
                    cb(err, rlp.decode(decoded[1]), posStack, nodeStack);
                }
            }
            else {
                cb(new Error('missing key in tree'), null, visitedPos, visitedStack);
            }
        }
    })
};

/**
 * finds value in tree
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
    self._sfind(rootHash, key, 0, [], [], cb);
};

function binarySearch(items, value){

    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(items[middle] != value && startIndex < stopIndex){

        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }

        //recalculate middle
        if (startIndex < stopIndex){
            middle = Math.floor((stopIndex + startIndex)/2);
        }
    }

    //make sure it's the right value
    return (value > items[middle]) ? middle + 1 : middle;
}

StateDB.prototype._sfindExpected = function (rootHash, key, pos,
                                             visitedPos, visitedStack,
                                             expectedPos, expectedStack,
                                             cb) {
    var self = this;
    if (expectedPos.length === 0 || expectedStack.length === 0) { // new end
        self._sfind(rootHash, key, pos, visitedPos, visitedStack, cb);
    }
    else if (rootHash.equals(expectedStack[0])) {
        cb(null, null, visitedPos.concat(expectedPos), visitedStack.concat(expectedStack)); // value didn`t change, retun new stack
    }
    else if (pos > expectedPos[0]) { // new end
        // TODO _sfindExpected
        var index = binarySearch(expectedPos, pos);
        expectedPos = expectedPos.splice(index,expectedPos.length - 1);
        expectedStack = expectedStack.splice(index,expectedStack.length - 1);
        self._sfindExpected(rootHash, key, pos, visitedPos, visitedStack, expectedPos, expectedStack, cb);
    }
    else {

        visitedPos.push(pos);
        visitedStack.push(rootHash);

        if (pos === expectedPos[0]) { // no new node on way
            expectedPos = expectedPos.splice(1,expectedPos.length - 1);
            expectedStack = expectedStack.splice(1,expectedStack.length - 1);
        }


        self.getNode(rootHash, function (err, decoded) {
            if (decoded.length === 17) {
                var _pos = Math.floor(pos / 2);
                var next = (pos % 2 === 0) ? Math.floor(key[_pos] / 16) : key[_pos] % 16;
                self._sfindExpected(decoded[next], key, pos + 1, visitedPos, visitedStack, expectedPos, expectedStack, cb)
            }
            else if (decoded[0] === undefined) {
                cb(new Error('missing key in tree'), null, visitedPos, visitedStack);
            }
            else {
                var baseNibble = Math.floor(decoded[0][0] / 16); // (bad way or) first nible of base
                var nodePath = self.compactToHex(decoded[0]);
                var keyString = key.toString('hex');
                if (nodePath === keyString.slice(pos, pos + nodePath.length)) {
                    if (baseNibble < 2 && pos + nodePath.length < keyString.length) {
                        self._sfindExpected(decoded[1], key, pos + nodePath.length, visitedPos, visitedStack, expectedPos, expectedStack, cb)
                    }
                    else if (baseNibble < 4 && pos + nodePath.length === keyString.length) {
                        cb(err, rlp.decode(decoded[1]), visitedPos, visitedStack);
                    }
                }
                else {
                    cb(new Error('missing key in tree'), null, visitedPos, visitedStack);
                }
            }
        })


    }
};

/**
 * finds value in tree, knowing expected path
 * @method sfindExpected
 * @param {String|Buffer} rootHash
 * @param {String|Buffer} key
 * @param expectedPos
 * @param expectedStack
 * @param {Function} cb the callback
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - stackPos - stack of position in key of nodes on path
 *  - stack - stack of hashes of nodes on path
 */
StateDB.prototype.sfindExpected = function (rootHash, key, expectedPos, expectedStack, cb) {
    var self = this;
    rootHash = self.bufferHex(rootHash);
    key = self.bufferHex(key);
    self._sfindExpected(rootHash, key, 0, [], [], expectedPos, expectedStack, cb);
};

StateDB.prototype._getRange = function (adress, startBlockNumber, endBlockNumber, index, array,
                                        worldStackPos, worldStackNode,
                                        storageStackPos, storageStackNode,
                                        cb) {
    var self = this;

    if (startBlockNumber < endBlockNumber) {

        self.blockStateRoot(startBlockNumber, function (err, stateRoot) {

            // find account
            self.sfindExpected(stateRoot, self.sha3(adress), worldStackPos, worldStackNode,
                function (err, node, worldStackPos, worldStackNode) {

                    var next = self.buffer64(parseInt('0x' + startBlockNumber.toString('hex')) + 1);

                    if (node === null) { // account didn`t changed

                        self._getRange(adress, next, endBlockNumber, index, array,
                            worldStackPos, worldStackNode,
                            storageStackPos, storageStackNode,
                            cb);

                    }
                    else {
                        // find variable

                        self.sfindExpected(node[2], self.sha3(index), storageStackPos, storageStackNode,
                            function (err, val, storageStackPos, storageStackNode) {
                                if ((err == null && val === null) || (err != null && array.slice(-1)[0]['val'] == null)) { // variable didn`t changed

                                    self._getRange(adress, next, endBlockNumber, index, array,
                                        worldStackPos, worldStackNode,
                                        storageStackPos, storageStackNode,
                                        cb);

                                }
                                else { // new value found

                                    array.push({'block': startBlockNumber, 'val': val});
                                    self._getRange(adress, next, endBlockNumber, index, array,
                                        worldStackPos, worldStackNode,
                                        storageStackPos, storageStackNode,
                                        cb);

                                }
                            });
                    }

                })

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
    index = self.buffer256(index);
    self.blockStateRoot(startBlockNumber, function (err, stateRoot) {
        self.sfind(stateRoot, self.sha3(adress), function (err, node, worldStackPos, worldStackNode) {
            self.sfind(node[2], self.sha3(index), function (err, val, storageStackPos, storageStackNode) {
                var next = self.buffer64(parseInt('0x' + startBlockNumber.toString('hex')) + 1);
                self._getRange(
                    adress, next, endBlockNumber, index,
                    [{'block': startBlockNumber, 'val': val}],
                    worldStackPos, worldStackNode,
                    storageStackPos, storageStackNode,
                    cb);
            });
        })
    })
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
    var workLength = length + (length % n === 0 ? 0 : (n - length % n));
    var period = Math.floor(workLength / n);

    var realN = Math.ceil(length / period);

    // console.log('getRangeMulti,worklength,period:', workLength, period);

    var result = new Array(realN);
    var ended = 0;

    var removeDuplicates = function () {
        var array = result[0];
        for (var i = 1; i < realN; i++) {
            if (result[i].length > 0) {
                if(array[array.length - 1]['val'].toString() === result[i][0]['val'].toString()){
                    result[i] = result[i].splice(1, result[i].length - 1)
                }
                array = array.concat(result[i]);
            }
        }
        return array;
    };

    var newCb = function (i) {
        return function (err, val) {
            // console.log('ended is: ',ended,'val',val,'i',i);
            result[i] = val;
            ended++;
            if (ended === realN) {
                // console.log('rawresult',result);
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        self.getRange(adress, index, _start, _end, newCb(i));
    }
    self.getRange(adress, index, start + workLength - period, end, newCb(realN - 1));


};

