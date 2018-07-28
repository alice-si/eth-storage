var Web3 = require("web3");

// conect with geth: geth --datadir ... --rinkeby --nodiscover --rpc
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var newCallback = function (i) {
    return function (err, storage) {
        console.log('storage at index (block '+i+':\n', storage);
    };
};

for (var i = 1111111; i < 1117810; i++){
    web3.eth.getStorageAt("0x6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
        1, // index
        i,
        newCallback(i))
}
