var StateDB = require('./lowLevel.js');

module.exports = StateDB;

/**
 * finds value in tree, gets expected path
 * @method walkTree
 * @param {String|Buffer} rootHash
 * @param {String|Buffer} key
 * @param depth
 * @param hashCollector
 * @param {Function} cb the callback
 * arguments
 *  - err - any errors encontered
 *  - node - the last node found
 *  - hashCollector
 */
StateDB.prototype.walkTree = function (rootHash, key, depth, hashCollector, cb) {
    var self = this;
    if (hashCollector.checkHash(rootHash)) {
        if (self.stats) self.hash_collector++;

        cb(null, null, hashCollector); // value didn`t change, retun new stack
    }
    else {
        if (self.stats) self.node_checked++;

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
 * finds first block where contract is live (or block not found)
 * @param adress
 * @param startBlockNumber
 * @param endBlockNumber
 * @param cb
 */
StateDB.prototype.binarySearchCreation = function (adress, startBlockNumber, endBlockNumber, cb) {
    var self = this;

    var startIndex = startBlockNumber,
        stopIndex = endBlockNumber,
        middle = Math.floor((stopIndex + startIndex) / 2);

    if (stopIndex - startIndex <= 0) {
        if (self.stats) self.bin_search++;

        cb(null, stopIndex);
    }
    else {

        self.getRange(adress, 0, middle, middle + 1,
            function (err, val) {
                if (val[0].val === 'contract not found') {
                    startIndex = middle + 1;
                }
                else {
                    stopIndex = middle;
                }
                self.binarySearchCreation(adress, startIndex, stopIndex, cb);
            },
            'none', false);

    }

};


/**
 * finds next potential block with change of contract
 * @param adress
 * @param startBlockNumber
 * @param endBlockNumber
 * @param cb
 * @param txReading
 */
StateDB.prototype.findNextBlock =
    function (adress, startBlockNumber, endBlockNumber, txReading, cb) {
        var self = this;
        adress = self.bufferHex(adress);
        startBlockNumber = self.bufferToInt(startBlockNumber);
        endBlockNumber = self.bufferToInt(endBlockNumber);

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
                if (self.stats) self.tx_lists_readed++;

                for (i = 0; i < body.transactionList.length; i++) {
                    if (self.stats) self.tx_readed++;

                    var to = body.transactionList[i][3].toString('hex');
                    if (to === adress.toString('hex')) {
                        if (self.stats) self.tx_found++;

                        self.contractCreated = true;
                        cb(null, startBlockNumber);
                        break;
                    }
                }
                if (i === body.transactionList.length) {
                    self.findNextBlock(adress, startBlockNumber + 1, endBlockNumber, txReading, cb)
                }

            })
        }
        else {
            cb(null, endBlockNumber);
        }
    };

