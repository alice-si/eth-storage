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
    _getRange(adr, index, startBlock, endBlock, [], cb);
};

module.exports.getRange = getRange;

sample:
getRange("0x6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 4, 1111111, 1111220,/*1117810*/ function (err, storage) {
    console.log('storage at index:\n', storage);
});

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
