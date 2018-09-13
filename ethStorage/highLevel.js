var StateDB = require('./querySplitter.js');

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
