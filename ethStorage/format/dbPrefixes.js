module.exports = {
// Info
    // databaseVerisionKey tracks the current database version.
    databaseVerisionKey: new Buffer("DatabaseVersion"),
    // headHeaderKey tracks the latest know header's hash.
    headHeaderKey: new Buffer("LastHeader"),
    // headBlockKey tracks the latest know full block's hash.
    headBlockKey: new Buffer("LastBlock"),
    // headFastBlockKey tracks the latest known incomplete block's hash duirng fast sync.
    headFastBlockKey: new Buffer("LastFast"),
    // fastTrieProgressKey tracks the number of trie entries imported during fast sync.
    fastTrieProgressKey: new Buffer("TrieSync"),

// Data item prefixes (use single byte to avoid mixing data types, avoid `i`, used for indexes).
    // headerPrefix + num (uint64 big endian) + hash -> header
    headerPrefix: new Buffer("h"),
    // headerPrefix + num (uint64 big endian) + hash + headerTDSuffix -> td
    headerTDSuffix: new Buffer("t"),
    // headerPrefix + num (uint64 big endian) + headerHashSuffix -> hash
    headerHashSuffix: new Buffer("n"),
    // headerNumberPrefix + hash -> num (uint64 big endian)
    headerNumberPrefix: new Buffer("H"),
    // blockBodyPrefix + num (uint64 big endian) + hash -> block body
    blockBodyPrefix: new Buffer("b"),
    // blockReceiptsPrefix + num (uint64 big endian) + hash -> block receipts
    blockReceiptsPrefix: new Buffer("r"),
    // txLookupPrefix + hash -> transaction/receipt lookup metadata
    txLookupPrefix: new Buffer("l"),
    // bloomBitsPrefix + bit (uint16 big endian) + section (uint64 big endian) + hash -> bloom bits
    bloomBitsPrefix: new Buffer("B"),
    // preimagePrefix + hash -> preimage
    preimagePrefix: new Buffer("secure-key-"),
    // config prefix for the db
    configPrefix: new Buffer("ethereum-config-"),
    // BloomBitsIndexPrefix is the data table of a chain indexer to track its progress // Chain index prefixes (use `i` + single byte to avoid mixing data types).
    BloomBitsIndexPrefix: new Buffer("iB")
};