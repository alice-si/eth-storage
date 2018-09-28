var StateDB = require('./querySplitter.js');

/**
 * Module is the highest layer,
 * gives wrappers for querying with different hash collecting methods
 * @module dataExtractors
 * @type {StateDB}
 */
module.exports = StateDB;

StateDB.prototype.simple = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    stateDB.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'none', txReading);
};

StateDB.prototype.hashSet = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    stateDB.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'hashSet', txReading);
};

StateDB.prototype.lastPath = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    stateDB.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'lastPath', txReading);
};
