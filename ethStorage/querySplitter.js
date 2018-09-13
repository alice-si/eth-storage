var StateDB = require('./dataExtractors.js');

module.exports = StateDB;

/**
 * gets variable states in block range, only first block and blocks where value changed,
 * uses n parallel workes
 * @method getRangeMulti
 * @param {String|Buffer} adress
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param {Function} cb the callback
 * @param n = 2, number of pararrel functions
 * @param method = undefined, specifies method of hash collecting (set,hashSet,lastPath,none)
 * @param txReading = true, if false block doesn`t require transaction sent to contract adress
 */
StateDB.prototype.getRangeMulti = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, method = undefined, txReading = true) {
    var self = this;

    if (self.stats) {
        self.tx_readed = 0;
        self.tx_lists_readed = 0;
        self.tx_found = 0;
        self.bin_search = 0;
        self.node_checked = 0;
        self.hash_collector = 0;
    }

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
                if (self.stats) console.log(
                    "tx_readed", self.tx_readed,
                    "tx_lists_readed", self.tx_lists_readed,
                    "tx_found", self.tx_found,
                    "bin_search", self.bin_search,
                    "node_checked", self.node_checked,
                    "hash_collector", self.hash_collector,
                );
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        self.getRange(adress, index, _start, _end, newCb(i), method, txReading);
    }
    self.getRange(adress, index, start + workLength - period, end, newCb(realN - 1), method, txReading);

};
