var Promise = require('bluebird')
var StateDB = require('./querySplitter.js');
var FORMATTER = require('../format/formatter');

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

/**
 * gets variable states in block range of blocks with numbers
 * greater equal startBlockNumber and less than endBlockNumber,
 * resulted array contains only first block and blocks where value changed
 * @method getRange
 * @param {String|Buffer} address
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param {Function} cb the callback
 * @param {string} method = undefined, specifies method of hash collecting ("set","hashSet","lastPath","none")
 * @param {boolean} txReading = true, if false block doesn`t require transaction sent to contract address
 */
StateDB.prototype.getRangeWeb3 = async function (web3, address, index, startBlockNumber, endBlockNumber) {
    var self = this;
    address = await FORMATTER.bufferHex(address);
    startBlockNumber = await FORMATTER.buffer64(startBlockNumber);
    endBlockNumber = await FORMATTER.buffer64(endBlockNumber);
    index = await FORMATTER.buffer256(index);
    startBlockNumber = await FORMATTER.bufferToInt(startBlockNumber);
    endBlockNumber = await FORMATTER.bufferToInt(endBlockNumber);
    index = await FORMATTER.bufferToInt(index)
    address = await FORMATTER.bufferToString(address);

    var array = []

    for (;startBlockNumber < endBlockNumber;startBlockNumber++) {
        await array.push({block: startBlockNumber, val: await parseInt(await web3.eth.getStorageAt(address,index,startBlockNumber))});
    }

    var removeDuplicates = async function (array) {
        var result = [array[0]];
        for (var i = 1; i < array.length; i++) {
            if (result[result.length - 1]['val'].toString() !== array[i]['val'].toString()) {
                await result.push(array[i])
            }
        }
        return result;
    };

    return await removeDuplicates(array)
};

