var Web3 = require("web3");

// connect with geth: geth --datadir ... --rinkeby --nodiscover --rpc
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var _getRange = function (adr, index, startBlock, endBlock, array, cb) {
    if (startBlock < endBlock) {
        web3.eth.getStorageAt(adr,
            index, // index
            startBlock,
            function (err, val) {
                if (array.length > 0 && array.slice(-1)[0]['val'] === val);
                else array.push({'block':startBlock,'val':val});
                _getRange(adr, index, startBlock + 1, endBlock, array, cb)
            })
    }
    else {
        cb(null, array);
    }
};

var getRange = function (adr, index, startBlock, endBlock, cb) {
    if (index instanceof Buffer) index = '0x' + index.toString('hex');
    _getRange(adr, index, startBlock, endBlock, [], cb);
};

/**
 * gets variable states in block range, only first block and blocks where value changed,
 * uses n parallel workes
 * @method getRangeMulti
 * @param {String|Buffer} adress
 * @param {Number|Buffer} index
 * @param {Number|Buffer} startBlockNumber
 * @param {Number|Buffer} endBlockNumber
 * @param n number of pararrel functions
 * @param {Function} cb the callback
 */
var getRangeMulti = function (adress, index, startBlockNumber, endBlockNumber, cb, n = 2) {
    if (index instanceof Buffer) index = '0x' + index.toString('hex');

    var start = startBlockNumber;
    var end = endBlockNumber;
    var length = end - start;
    var workLength = length + (length % n === 0 ? 0 : n - length % n);
    var period = Math.floor(workLength / n);

    // console.log('getRangeMulti,worklength,period:', workLength, period);

    var result = new Array(n);
    var ended = 0;

    var removeDuplicates = function () {
        var array = result[0];
        for (var i = 1; i < n; i++) {
            if (result[i].length > 0) {
                array.concat(array[array.length - 1]['val'] === result[i][0]['val'] ? result[i].splice(1, result[i].length - 1) : result[i])
            }
        }
        return array;
    };

    var newCb = function (i) {
        return function (err, val) {
            // console.log('ended is: ',ended,'val',val,'i',i);
            result[i] = val;
            ended++;
            if (ended === n) {
                // console.log(result);
                cb(null, removeDuplicates());
            }
        }
    };

    for (var i = 0, _start = start, _end = start + period; _end < end; i++, _start += period, _end += period) {
        getRange(adress, index, _start, _end, newCb(i));
    }
    getRange(adress, index, start + workLength - period, end, newCb(n - 1));


};

module.exports.getRange = getRange;
module.exports.getRangeMulti = getRangeMulti;

// sample:
// getRange("0x6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 4, 1111111, 1111220,/*1117810*/ function (err, storage) {
//     console.log('storage at index:\n', storage);
// });

// output
// storage at index:
//     [ { block: 1111111,
//         val: '0x0000000000000000000000000000000000000000000000000000000000000002' },
//         { block: 1111315, val: undefined },
//         { block: 1111674,
//             val: '0x0000000000000000000000000000000000000000000000000000000000000002' },
//         { block: 1111675, val: undefined },
//         { block: 1111686,
//             val: '0x0000000000000000000000000000000000000000000000000000000000000002' } ]
