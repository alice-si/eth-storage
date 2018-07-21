var Trie = require('../merkle-patricia-tree');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');
const ethUtil = require('ethereumjs-util')
const asyncFirstSeries = require('./util').asyncFirstSeries



// databaseVerisionKey tracks the current database version.
var databaseVerisionKey = new Buffer("DatabaseVersion")

// headHeaderKey tracks the latest know header's hash.
var headHeaderKey = new Buffer("LastHeader")

// headBlockKey tracks the latest know full block's hash.
var headBlockKey = new Buffer("LastBlock")

// headFastBlockKey tracks the latest known incomplete block's hash duirng fast sync.
var headFastBlockKey = new Buffer("LastFast")

// fastTrieProgressKey tracks the number of trie entries imported during fast sync.
var fastTrieProgressKey = new Buffer("TrieSync")

// Data item prefixes (use single byte to avoid mixing data types, avoid `i`, used for indexes).
var headerPrefix = new Buffer("h") // headerPrefix + num (uint64 big endian) + hash -> header
var headerTDSuffix = new Buffer("t") // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td
var headerHashSuffix = new Buffer("n") // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
var headerNumberPrefix = new Buffer("H") // headerNumberPrefix + hash -> num (uint64 big endian)

var blockBodyPrefix = new Buffer("b") // blockBodyPrefix + num (uint64 big endian) + hash -> block body
var blockReceiptsPrefix = new Buffer("r") // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts

var txLookupPrefix = new Buffer("l") // txLookupPrefix + hash -> transaction/receipt lookup metadata
var bloomBitsPrefix = new Buffer("B") // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits

var preimagePrefix = new Buffer("secure-key-")      // preimagePrefix + hash -> preimage
var configPrefix = new Buffer("ethereum-config-") // config prefix for the db

// Chain index prefixes (use `i` + single byte to avoid mixing data types).
var BloomBitsIndexPrefix = new Buffer("iB") // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress

function StateDB(db_path) {
    this.db = levelup(leveldown(db_path));
    this.n = 3;
}

StateDB.prototype.hashBuffer = function (hash) {
    return new Buffer(hash, 'hex');
};

StateDB.prototype.sha3 = ethUtil.sha3;

StateDB.prototype.blockNumberByHash = function (hash_buf, cb) {
    var self = this;
    var query = Buffer.concat([headerNumberPrefix, hash_buf]);
    self.db.get(query, function (err, val) {
        console.log('blockNumberByHash ', val);
        cb(err, val);
    });
};

StateDB.prototype.blockHash = function (blockNumber, cb) {
    var self = this;
    query = Buffer.concat([headerPrefix, blockNumber, headerHashSuffix]);
    self.db.get(query, function (err, val) {
        console.log('blockHash: ', val);
        cb(err, val);
    })
};

StateDB.prototype._blockHeader = function (blockNumber, blockHash, cb) {
    var self = this;
    var headerQuery = Buffer.concat([headerPrefix, blockNumber, blockHash]);
    self.db.get(headerQuery, function (err, val) {
        // console.log('_blockRawHeader ', val);
        var decoded = rlp.decode(val);
        // console.log('_blockHeader ', decoded);
        cb(err, decoded);
    })
};

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
        // console.log('_blockRawHeader ', val);
        var decoded = rlp.decode(val);
        // console.log('_blockHeader ', decoded);
        cb(err, decoded);
    });
};

StateDB.prototype.blockBody = function (blockNumber, cb) {
    var self = this;
    self.blockHash(blockNumber, function (err, val) {
        self._blockBody(blockNumber, val, cb);
    });
};

StateDB.prototype.blockHeaderByHash = function (blockHash, cb) {
    var self = this;
    self.blockNumberByHash(blockHash, function (err, val) {
        self._blockHeader(val, blockHash, cb);
    });
};

StateDB.prototype.blockStateRoot = function (blockNumber, cb) {
    var self = this;
    self.blockHeader(blockNumber, function (err, val) {
        cb(err, val[3]);
    })
};

StateDB.prototype.blockQuery = function (blocknumber, hash) {
    return Buffer.concat([blockBodyPrefix, blocknumber, hash])
};


var prefixGetRow = function (prefix) {
    return function (key, cb) {
        key = ethUtil.toBuffer(key)

        var prefix_key = Buffer.concat([prefix, key])

        console.log('prefixGetRow', 'will dbget', 'prefixkey', prefix_key)
        prefix_key = key

        function dbGet(db, cb2) {
            db.get(prefix_key, {
                keyEncoding: 'binary',
                valueEncoding: 'binary'
            }, function (err, foundNode) {
                if (err || !foundNode) {
                    cb2(null, null)
                } else {
                    cb2(null, foundNode)
                }
            })
        }

        asyncFirstSeries(this._getDBs, dbGet, cb)
    };
};

StateDB.prototype.getNode = function (hash, cb) {
    var self = this;
    self.db.get(hash, function (err, val) {
        var decoded = rlp.decode(val);
        // var decoded = val;
        cb(err, decoded);
    })
};

StateDB.prototype.compactToHex = function (base) {
    var baseNibble = Math.floor(base[0] / 16); // first nible of base
    base = base.toString('hex');
    console.log('base:', base);
    // delete terminator flag
    if (baseNibble < 2) {
        base = base.slice(0, base.length - 1);
    }
    // apply odd flag
    var chop = 2 - baseNibble % 2;
    console.log('chop is:', chop);
    return base.slice(chop, base.length);
};

StateDB.prototype.find = function (node_hash, key, pos, cb) {
    var self = this;
    self.getNode(node_hash, function (err, decoded) {
        if (decoded.length == 17) {
            console.log('find:branchnodefound');
            var _pos = Math.floor(pos / 2);
            var next = (pos % 2 == 0) ? Math.floor(key[_pos] / 16) : key[_pos] % 16;
            console.log('find:next', next);
            self.find(decoded[next], key, pos + 1, cb)
        }
        else {
            console.log('find:othernodefound');
            console.log('other node: key:',decoded[0]);
            console.log('other node [1]:',rlp.decode(decoded[1]));
            var nodePath = self.compactToHex(decoded[0])
            console.log('nodePath',nodePath);
            console.log('key.toString',key.toString('hex'));
            console.log('pos',pos,'key.len',key.length,'nodePath.len',nodePath.length);
            var keyString = key.toString('hex');
            if (nodePath == keyString.slice(pos,pos + nodePath.length)) {
                console.log('find:next', nodePath);
                if (pos + nodePath.length == keyString.length) {
                    console.log('find:leaf');
                    cb(err,rlp.decode(decoded[1]));
                }
                else if (pos + nodePath.length < keyString.length) {
                    console.log('find:extension');
                    self.find(decoded[1], key, pos + nodePath.length, cb)
                }
                else{
                    console.log('find:error')
                    cb(err,null);
                }
            }
        }
        // console.log('find ', decoded);
        // console.log('dec [0]', decoded[0]);
        // console.log('dec [0][0] % 16', decoded[0][0] % 16);
    })
};

StateDB.prototype.storage = function (contractAddres, blockNumber, cb) {
    var self = this;
    self.blockStateRoot(blockNumber, function (err, root) {
        var addressPath = self.hashBuffer(
            self.sha3(contractAddres));
        console.log('buff (adress)',addressPath);
        self.find(root,addressPath,0,cb)
    });
};


// StateDB.prototype.

module.exports = StateDB;
