var StateDB = require('./trieTraversals.js');
var HashCollector = require('../collectors/hashCollector');
var FORMATTER = require('../format/formatter');

/**
 * Module is the 3nd layer,
 * gives function for quering contract variable state in range
 * @module dataExtractors
 * @type {StateDB}
 */
module.exports = StateDB;

/**
 * finds first block where contract is live,
 * if not found gives endBlockNumber
 * @method binarySearchCreation
 * @param {string|buffer} address
 * @param {number|buffer} startBlockNumber
 * @param {number|buffer} endBlockNumber
 * @param cb
 */
StateDB.prototype.binarySearchCreation = function (address, startBlockNumber, endBlockNumber, cb) {
    var self = this;

    var startIndex = startBlockNumber,
        stopIndex = endBlockNumber,
        middle = Math.floor((stopIndex + startIndex) / 2);

    if (stopIndex - startIndex <= 0) {
        self.statsCollector.binarySearch();
        cb(null, stopIndex);
    }
    else {

        self.getRange(address, 0, middle, middle + 1,
            function (err, val) {
                if (val[0].val === 'contract not found') {
                    startIndex = middle + 1;
                }
                else {
                    stopIndex = middle;
                }
                self.binarySearchCreation(address, startIndex, stopIndex, cb);
            },
            'none', false);

    }

};

/**
 * checks value founded when searching for new contract variable value,
 * handles error, if new value is found it adds it to array
 * it chooses new block to search change for
 * @method checkValue
 * @param err
 * @param msg
 * @param adress
 * @param val
 * @param startBlockNumber
 * @param endBlockNumber
 * @param index
 * @param array
 * @param hashCollector
 * @param txReading
 * @param cb
 */
StateDB.prototype.checkValue =
    function (err, msg, adress, val, startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb) {
    var self = this;

    if (msg === 'found' &&
        (array.length === 0 || val.toString('hex') !== FORMATTER.bufferHex(array[array.length - 1].val).toString('hex'))) {
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

                self.walkTree(stateRoot, FORMATTER.sha3(adress), 0, hashCollector.newBlock(), function (err, node, hashCollector) {
                    if (node === null) { // account didn`t changed
                        self.checkValue(
                            err, 'contract not found', adress, null,
                            startBlockNumber, endBlockNumber, index, array, hashCollector, txReading, cb);
                    }
                    else {
                        self.walkTree(node[2], FORMATTER.sha3(index), 0, hashCollector.goStorage(), function (err, val, hashCollector) {
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
StateDB.prototype.getRange = function (address, index, startBlockNumber, endBlockNumber, cb, method = undefined, txReading = true) {
    var self = this;
    address = FORMATTER.bufferHex(address);
    startBlockNumber = FORMATTER.buffer64(startBlockNumber);
    endBlockNumber = FORMATTER.buffer64(endBlockNumber);
    startBlockNumber = FORMATTER.bufferToInt(startBlockNumber);
    endBlockNumber = FORMATTER.bufferToInt(endBlockNumber);
    index = FORMATTER.buffer256(index);
    self._getRange(address, startBlockNumber, endBlockNumber, index, [], new HashCollector(method), txReading, cb);
};
