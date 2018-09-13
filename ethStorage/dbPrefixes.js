module.exports = {
// Info
    databaseVerisionKey: new Buffer("DatabaseVersion"), // databaseVerisionKey tracks the current database version.
    headHeaderKey: new Buffer("LastHeader"), // headHeaderKey tracks the latest know header's hash.
    headBlockKey: new Buffer("LastBlock"), // headBlockKey tracks the latest know full block's hash.
    headFastBlockKey: new Buffer("LastFast"), // headFastBlockKey tracks the latest known incomplete block's hash duirng fast sync.
    fastTrieProgressKey: new Buffer("TrieSync"), // fastTrieProgressKey tracks the number of trie entries imported during fast sync.

// Data item prefixes (use single byte to avoid mixing data types, avoid `i`, used for indexes).
    headerPrefix: new Buffer("h"), // headerPrefix + num (uint64 big endian) + hash -> header
    headerTDSuffix: new Buffer("t"), // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td
    headerHashSuffix: new Buffer("n"), // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
    headerNumberPrefix: new Buffer("H"), // headerNumberPrefix + hash -> num (uint64 big endian)
    blockBodyPrefix: new Buffer("b"), // blockBodyPrefix + num (uint64 big endian) + hash -> block body
    blockReceiptsPrefix: new Buffer("r"), // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts
    txLookupPrefix: new Buffer("l"), // txLookupPrefix + hash -> transaction/receipt lookup metadata
    bloomBitsPrefix: new Buffer("B"), // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits
    preimagePrefix: new Buffer("secure-key-"),      // preimagePrefix + hash -> preimage
    configPrefix: new Buffer("ethereum-config-"), // config prefix for the db
    BloomBitsIndexPrefix: new Buffer("iB") // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress // Chain index prefixes (use `i` + single byte to avoid mixing data types).
};