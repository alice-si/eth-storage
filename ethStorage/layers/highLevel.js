var Promise = require('bluebird')
var StateDB = require('./querySplitter.js');

/**
 * Module is the highest layer,
 * gives wrappers for querying with different hash collecting methods
 * @module dataExtractors
 * @type {StateDB}
 */
module.exports = StateDB;

StateDB.prototype.simple = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    var self = this;
    self.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'none', txReading);
};

StateDB.prototype.hashSet = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    var self = this;
    self.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'hashSet', txReading);
};

StateDB.prototype.lastPath = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2, txReading = true) {
    var self = this;
    self.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, 'lastPath', txReading);
};

StateDB.prototype.promiseGetRange = function (adress, index, startBlockNumber, endBlockNumber, method = 'hashSet', n = 2, txReading = true) {
    var self = this;
    return new Promise((resolve, reject) => {
        var cb = (err, events) => {
            if (err) return reject(err)
            else return resolve(events)
        }
        self.getRangeMulti(adress, index, startBlockNumber, endBlockNumber, cb, n, method, txReading)
    })
};

StateDB.prototype.promiseEnd = (resolve, reject) => (err, val) => {
    if (err) return reject(err);
    else return resolve(val)
}

StateDB.prototype.promiseLastFullBlock = function () {
    var self = this;
    return new Promise((resolve, reject) => {
        var cb = (err, events) => {
            if (err) return reject(err)
            else return resolve(events)
        }
        self.latestHeaderNumber(cb)
    })
}

