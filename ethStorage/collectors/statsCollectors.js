/**
 * Implementation of StatsCollector
 * @type {StatsCollector}
 */
module.exports = StatsCollector;

/**
 * Stats collector receives information about events in code
 * and collect statistics
 * @class StateDB
 * @param {Boolean} stats
 */
function StatsCollector(stats=false) {
    var self = this;
    self.stats = stats;
    self.clear();
}

/**
 * clears statistics
 * @method clear
 */
StatsCollector.prototype.clear = function () {
    var self = this;
    if (self.stats) {
        self.tx_readed = 0; // how many transactions were readed
        self.tx_lists_readed = 0; // how many transaction lists of blocks were read
        self.tx_found = 0; // how many blocks with transaction to contract were found
        self.bin_search = 0; // how many times binarySearchCreation function were used
        self.node_checked = 0; // how many merkle patricia tree nodes were queried form database
        self.hash_collector = 0; // how many times hash collector shorted building merkle patricia tree
    }
};

/**
 * @method logStats
 */
StatsCollector.prototype.logStats = function () {
    var self = this;
    if (self.stats) console.log(
        "tx_readed", self.tx_readed,
        "tx_lists_readed", self.tx_lists_readed,
        "tx_found", self.tx_found,
        "bin_search", self.bin_search,
        "node_checked", self.node_checked,
        "hash_collector", self.hash_collector,
    );
};

/**
 * New transaction was read
 * @method newBlock
 */
StatsCollector.prototype.txRead = function () {
    var self = this;
    if (self.stats) self.tx_readed++;
};

/**
 * New block transaction lists were started to read
 * @method txListRead
 */
StatsCollector.prototype.txListRead = function () {
    var self = this;
    if (self.stats) self.tx_lists_readed++;
};

/**
 * New transaction to contract was found
 * @method txFound
 */
StatsCollector.prototype.txFound = function () {
    var self = this;
    if (self.stats) self.tx_found++;
};

/**
 * Binary searching of contract creation ended
 * @method binarySearch
 */
StatsCollector.prototype.binarySearch = function () {
    var self = this;
    if (self.stats) self.bin_search++;
};

/**
 * New node were getted from databas
 * @method nodeChecked
 */
StatsCollector.prototype.nodeChecked = function () {
    var self = this;
    if (self.stats) self.node_checked++;
};

/**
 * Hash collector shorted building merkle patricia trie
 * @method hashCollector
 */
StatsCollector.prototype.hashCollector = function () {
    var self = this;
    if (self.stats) self.hash_collector++;
};

