var StateDB = require('./trieTraversals.js');
var HashCollector = require('./hashCollector');

module.exports = StateDB;

StateDB.prototype.checkValue = function (err, msg, adress, val, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb) {
    var self = this;

    if (msg === 'found' &&
        (array.length === 0 || val.toString('hex') !== self.bufferHex(array[array.length - 1].val).toString('hex'))) {
        array.push({block: startBlockNumber, val: val});
    }
    else if (array.length === 0 || (err !== null && array[array.length - 1].val !== msg)) {
        array.push({block: startBlockNumber, val: msg});
    }

    if (err !== null && msg === 'contract not found') {
        self.binarySearchCreation(adress, startBlockNumber + 1, endBlockNumber, function (err, next) {
            self._getRange(adress, next, endBlockNumber, index, array, hashCollector, txReading, cb);
        })
    }
    else {
        self.findNextBlock(adress, startBlockNumber + 1, endBlockNumber, txReading, function (err, next) {
            self._getRange(adress, next, endBlockNumber, index, array, hashCollector, txReading, cb);
        })
    }

};

StateDB.prototype._getRange = function (adress, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb) {
    var self = this;
    if (startBlockNumber < endBlockNumber) {
        self.blockStateRoot(startBlockNumber, function (err, stateRoot) { // find account
            if (err !== null) {
                self.checkValue(err, 'block not found', adress, null, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb);
            }
            else {

                self.walkTree(stateRoot, self.sha3(adress), 0, hashCollector.newBlock(), function (err, node, hashCollector) {
                    if (node === null) { // account didn`t changed
                        self.checkValue(
                            err, 'contract not found', adress, null,
                            startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb);
                    }
                    else {
                        self.walkTree(node[2], self.sha3(index), 0, hashCollector.goStorage(), function (err, val, hashCollector) {
                            if (val === null) {
                                self.checkValue(err, 'uninitialised', adress, null, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb);
                            }
                            else {
                                self.checkValue(err, 'found', adress, val, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb);
                            }
                        });
                    }

                })
            }

        });

    }
    else {
        cb(null, array); // return result
    }
};

/**
 * gets variable states in block range, only first block and blocks where value changed
 * @method getRange
 * @param {String|Buffer} adress
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param {Function} cb the callback
 * @param method = undefined, specifies method of hash collecting (set,hashSet,lastPath,none)
 * @param txReading = true, if false block doesn`t require transaction sent to contract adress
 */
StateDB.prototype.getRange = function (adress, index, startBlockNumber, endBlockNumber, cb, method = undefined, txReading = true) {
    var self = this;
    adress = self.bufferHex(adress);
    startBlockNumber = self.buffer64(startBlockNumber);
    endBlockNumber = self.buffer64(endBlockNumber);
    startBlockNumber = self.bufferToInt(startBlockNumber);
    endBlockNumber = self.bufferToInt(endBlockNumber);
    index = self.buffer256(index);
    self._getRange(adress, startBlockNumber, endBlockNumber, index, [], new HashCollector(method), txReading, cb);
};
