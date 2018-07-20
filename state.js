var Trie = require('../merkle-patricia-tree');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');



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
var headerPrefix       = new Buffer("h") // headerPrefix + num (uint64 big endian) + hash -> header
var headerTDSuffix     = new Buffer("t") // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td
var headerHashSuffix   = new Buffer("n") // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
var headerNumberPrefix = new Buffer("H") // headerNumberPrefix + hash -> num (uint64 big endian)

var blockBodyPrefix     = new Buffer("b") // blockBodyPrefix + num (uint64 big endian) + hash -> block body
var blockReceiptsPrefix = new Buffer("r") // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts

var txLookupPrefix  = new Buffer("l") // txLookupPrefix + hash -> transaction/receipt lookup metadata
var bloomBitsPrefix = new Buffer("B") // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits

var preimagePrefix = new Buffer("secure-key-")      // preimagePrefix + hash -> preimage
var configPrefix   = new Buffer("ethereum-config-") // config prefix for the db

// Chain index prefixes (use `i` + single byte to avoid mixing data types).
var BloomBitsIndexPrefix = new Buffer("iB") // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress

function StateDB(db_path) {
    this.db = levelup(leveldown(db_path));
    this.n = 3;
}

StateDB.prototype.hashBuffer = function (hash) {
    return new Buffer(hash, 'hex');
};

StateDB.prototype.blockNumberByHash = function (hash_buf,cb) {
    var self = this;
    var query = Buffer.concat([headerNumberPrefix,hash_buf]);
    self.db.get(query,function (err, val) {
        console.log('_blockNumber ',val);
        cb(err,new Buffer(val));
    });
};

StateDB.prototype.blockHash = function (blockNumber,cb) {
    var self = this;
    query = Buffer.concat([headerPrefix,blockNumber,headerHashSuffix]);
    self.db.get(query,function (err,val) {
        console.log('_blockHash: ', val);
        cb(err,new Buffer(val));
    })
};

StateDB.prototype._blockHeader = function (blockNumber,blockHash,cb) {
    var self = this;
    var headerQuery = Buffer.concat([headerPrefix,blockNumber,blockHash]);
    self.db.get(headerQuery,function (err,val) {
        console.log('_blockRawHeader ', val);
        var decoded =  rlp.decode(val);
        console.log('_blockHeader ', decoded);
        cb(err,decoded);
    })
};

StateDB.prototype.blockHeader = function (blockNumber,cb) {
    var self = this;
    self.blockHash(blockNumber,function (err,val) {
        self._blockHeader(blockNumber,val,cb);
    });
};

StateDB.prototype.blockHeaderByHash = function (blockHash,cb) {
    var self = this;
    self.blockNumberByHash(blockHash,function (err, val) {
        self._blockHeader(val,blockHash,cb);
    });
};

module.exports = StateDB;
