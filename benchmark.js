var Web3 = require("web3");

// connect with geth: geth --datadir ... --rinkeby --nodiscover --rpc
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var _getRange = function (adr, index, startBlock, endBlock, array, cb) {
    if (startBlock < endBlock) {
        web3.eth.getStorageAt(adr,
            index, // index
            startBlock,
            function (err, val) {
                array.push(val);
                _getRange(adr, index, startBlock + 1, endBlock, array, cb)
            })
    }
    else {
        cb(null, array);
    }
};

var getRange = function (adr, index, startBlock, endBlock, cb) {
    _getRange(adr, index, startBlock, endBlock, [], cb);
};

module.exports.getRange = getRange;

// getRange("0x6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 1, 1111111, 1117810, function (err, storage) {
//     console.log('storage at index:\n', storage);
// });
