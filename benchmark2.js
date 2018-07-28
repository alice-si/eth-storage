var Web3 = require("web3");

// conect with geth: geth --datadir ... --rinkeby --nodiscover --rpc
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var newCallback = function (i) {
    return function (err, storage) {
        console.log('storage at index (block '+i+':\n', storage);
    };
};

var getRange = function (addr,index,startBlock,endBlock) {
    for (var i = startBlock; i < endBlock; i++) {
        web3.eth.getStorageAt(addr,
            index, // index
            i,
            newCallback(i))
    }
};

module.exports.getRange = getRange;

// sample
// getRange("0x6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 1, 1111111, 1117810)
