var StateDB = require('./dataExtractors.js');
var FORMATTER = require('../format/formatter');

/**
 * Module is the 4nd layer,
 * gives function
 * which query variable state in range by splitting range in parts
 * @module dataExtractors
 * @type {StateDB}
 */
module.exports = StateDB;

/**
 * wrapper for getRange, splits range in parts,
 * uses n parallel workers
 * @method getRangeMulti
 * @param {String|Buffer} address
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param {Function} cb the callback
 * @param {int} n = 2, number of pararrel functions
 * @param {string|undefined} method = undefined, specifies method of hash collecting (set,hashSet,lastPath,none)
 * @param {boolean} txReading = true, if false block doesn`t require transaction sent to contract address
 */
StateDB.prototype.getRangeMulti = function (address, index, startBlockNumber, endBlockNumber, cb, n = 2, method = undefined, txReading = true) {
    var self = this;

    self.statsCollector.clear();

    address = FORMATTER.bufferHex(address);
    startBlockNumber = FORMATTER.buffer64(startBlockNumber);
    endBlockNumber = FORMATTER.buffer64(endBlockNumber);
    index = FORMATTER.buffer256(index);

    var start = FORMATTER.bufferToInt(startBlockNumber);
    var end = FORMATTER.bufferToInt(endBlockNumber);
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
                self.statsCollector.logStats();
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        self.getRange(address, index, _start, _end, newCb(i), method, txReading);
    }
    self.getRange(address, index, start + workLength - period, end, newCb(realN - 1), method, txReading);

};
