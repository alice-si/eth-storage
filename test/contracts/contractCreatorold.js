var getSchwifty = eth.contract([{
    "constant": true,
    "inputs": [],
    "name": "getStorageInt",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "sStorageString",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getStorageByte",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_storage", "type": "uint256"}],
    "name": "setStorageInt",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_storage", "type": "string"}],
    "name": "setStorageString",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "sStorageByte",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "sStorageInt",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_storage", "type": "bytes32"}],
    "name": "setStorageByte",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getStorageString",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}]);
var bytecode = '0x608060405234801561001057600080fd5b506105a3806100206000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632bd716311461009e57806334176629146100c95780633df75cdc1461015957806367e04c631461018c578063723d4145146101b95780637df1e5b214610222578063ab3311bd14610255578063ec8323eb14610280578063fe6d7bf7146102b1575b600080fd5b3480156100aa57600080fd5b506100b3610341565b6040518082815260200191505060405180910390f35b3480156100d557600080fd5b506100de61034a565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561011e578082015181840152602081019050610103565b50505050905090810190601f16801561014b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561016557600080fd5b5061016e6103e8565b60405180826000191660001916815260200191505060405180910390f35b34801561019857600080fd5b506101b7600480360381019080803590602001909291905050506103f2565b005b3480156101c557600080fd5b50610220600480360381019080803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506103fc565b005b34801561022e57600080fd5b50610237610416565b60405180826000191660001916815260200191505060405180910390f35b34801561026157600080fd5b5061026a61041c565b6040518082815260200191505060405180910390f35b34801561028c57600080fd5b506102af6004803603810190808035600019169060200190929190505050610422565b005b3480156102bd57600080fd5b506102c6610430565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103065780820151818401526020810190506102eb565b50505050905090810190601f1680156103335780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60008054905090565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103e05780601f106103b5576101008083540402835291602001916103e0565b820191906000526020600020905b8154815290600101906020018083116103c357829003601f168201915b505050505081565b6000600154905090565b8060008190555050565b80600290805190602001906104129291906104d2565b5050565b60015481565b60005481565b806001816000191690555050565b606060028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104c85780601f1061049d576101008083540402835291602001916104c8565b820191906000526020600020905b8154815290600101906020018083116104ab57829003601f168201915b5050505050905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061051357805160ff1916838001178555610541565b82800160010185558215610541579182015b82811115610540578251825591602001919060010190610525565b5b50905061054e9190610552565b5090565b61057491905b80821115610570576000816000905550600101610558565b5090565b905600a165627a7a723058203eab8a59151a440337a5aea58338ebffe53c5cd88e964e0fdd7c33c91e6992570029';
var deploy = {from: eth.coinbase, data: bytecode, gas: 2000000};

var getSchwiftyPartialInstance = getSchwifty.new("DISQUALIFIED!", deploy);
var con1 = getSchwifty.at(getSchwiftyPartialInstance.address);
getSchwiftyPartialInstance2 = getSchwifty.new("DISQUALIFIED!", deploy);
var con2 = getSchwifty.at(getSchwiftyPartialInstance2.address);
getSchwiftyPartialInstance3 = getSchwifty.new("DISQUALIFIED!", deploy);
var con3 = getSchwifty.at(getSchwiftyPartialInstance3.address);




// var adi1 = "0x16c8985321696c21d58f3194eee166eedaf37356"
//
// var adi2 = "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad"
//
// var adi3 = "0x68abe76de1aaaace161bae789a71e54183e1df8b"
// var con1 = getSchwifty.at(adi1);
// var con2 = getSchwifty.at(adi2);
// var con3 = getSchwifty.at(adi3);

/*
var timeOutIt = function (cb,times,timeOut) {
    if(times > 0){
        cb();
        setTimeout(function () {
            timeOutIt(cb,times - 1,timeOut)
        },timeOut)
    }
};

var string_generator = 'wertesumpsmumkomertyhunersyduczywaporykubaniskirem';

var contractChange = function(contract){
    var getData1 = contract.setStorageInt.getData(Math.floor(Math.random() * 100));

    var rnd = Math.floor(Math.random() * string_generator.length);
    var rem = string_generator.length - rnd;
    var rnd2 = rnd + Math.floor(Math.random() * rem);

    var getData2 = contract.setStorageString.getData(string_generator.slice(rnd,rnd2));
    var getData3 = contract.setStorageByte.getData(string_generator.slice(rnd,rnd2));

    console.log('sending');
    web3.eth.sendTransaction({to:contract.address, from:eth.coinbase, data: getData1});
    web3.eth.sendTransaction({to:contract.address, from:eth.coinbase, data: getData2});
    web3.eth.sendTransaction({to:contract.address, from:eth.coinbase, data: getData3});
};

timeOutIt(function () { // 1000 times through 10000 blocks
    contractChange(con1)
},1000,1000*15*10);

timeOutIt(function () { // 100 times through 10000 blocks
    contractChange(con2)
},100,1000*15*100);

timeOutIt(function () { // 10 times through 10000 blocks
    contractChange(con3)
},10,1000*15*1000);

*/