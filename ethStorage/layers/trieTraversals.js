var StateDB = require('./lowLevel.js');
var FORMATTER = require('../format/formatter');

/**
 * Module is the 2nd layer,
 * gives getters for more complex data from database:
 * recurrent finding node in DB,
 * finding next block with transactions to given contract
 * @module trieTraversals
 * @type {StateDB}
 */
module.exports = StateDB;

/**
 * finds value in merkle patricia tree,
 * gets expected path and hash collector
 * @method walkTree
 * @param {String|Buffer} rootHash
 * @param {String|Buffer} key
 * @param {int} depth
 * @param {HashCollector} hashCollector
 * @param {Function} cb the callback
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - hashCollector
 */
StateDB.prototype.walkTree = function (rootHash, key, depth, hashCollector, cb) {
    var self = this;
    if (hashCollector.checkHash(rootHash)) {
        self.statsCollector.hashCollector();

        cb(null, null, hashCollector); // value didn`t change, retun new stack
    }
    else {
        self.statsCollector.nodeChecked();

        hashCollector.addHash(rootHash, depth); // add to map

        self.getNode(rootHash, function (err, node) {
            if (node === null) {
                cb(err, node, hashCollector);
            }
            else if (node.type === 'branch') {
                var _pos = Math.floor(depth / 2);
                var next = (depth % 2 === 0) ? Math.floor(key[_pos] / 16) : key[_pos] % 16;
                self.walkTree(node.children[next], key, depth + 1, hashCollector, cb)
            }
            else {
                var keyString = key.toString('hex');
                if (node.path === keyString.slice(depth, depth + node.path.length)) {
                    if (node.type === 'extension' && depth + node.path.length < keyString.length) {
                        self.walkTree(node.child, key, depth + node.path.length, hashCollector, cb)
                    }
                    else if (node.type === 'leaf' && depth + node.path.length === keyString.length) {
                        cb(err, node.value, hashCollector); // value found
                    }
                }
                else {
                    cb(new Error('missing key in tree'), null, hashCollector);
                }
            }
        })


    }
};


/**
 * finds next potential block with change of contract,
 * reads transactions lists
 * and returns next block with transaction to given contract
 * if txReading is false it retruns startBlockNumber + 1
 * @param {string|Buffer} address
 * @param {number|Buffer} startBlockNumber
 * @param {number|Buffer} endBlockNumber
 * @param {boolean} txReading
 * @param {function} cb
 */
StateDB.prototype.findNextBlock =
    function (address, startBlockNumber, endBlockNumber, txReading, cb) {
        var self = this;
        address = FORMATTER.bufferHex(address);
        startBlockNumber = FORMATTER.bufferToInt(startBlockNumber);
        endBlockNumber = FORMATTER.bufferToInt(endBlockNumber);

        if (txReading === false) {
            cb(null, startBlockNumber + 1);
            return;
        }

        if (startBlockNumber < endBlockNumber) {
            self.blockBody(startBlockNumber, function (err, body) {
                if (err != null) {
                    cb(null, startBlockNumber);
                    return;
                }
                var i;
                self.statsCollector.txListRead();
                for (i = 0; i < body.transactionList.length; i++) {
                    self.statsCollector.txRead();
                    var to = body.transactionList[i][3].toString('hex');
                    if (to === address.toString('hex')) {
                        self.statsCollector.txFound();
                        self.contractCreated = true;
                        cb(null, startBlockNumber);
                        break;
                    }
                }
                if (i === body.transactionList.length) {
                    self.findNextBlock(address, startBlockNumber + 1, endBlockNumber, txReading, cb)
                }

            })
        }
        else {
            cb(null, endBlockNumber);
        }
    };

