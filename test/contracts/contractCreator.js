var Web3 = require('web3');
const fs = require('fs');

var myAccount = "0x4b1df37f8e626d8bee43f7a45c0ac070279edc8a";

// var web3;
var hej = 0;

var deployedContractsFile = 'deployedContracts.json';
var contractsHistoryFile = 'contractsHistory.json';

async function setWeb3() {
    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    web3 = new Web3(provider);
    console.log(web3.version);
    web3.eth.getStorageAt("0x16c8985321696c21d58f3194eee166eedaf37356",0,'latest',console.log);
    hej = 2;
};

async function unlockAccount() {
    await fs.readFile('accountData', async function read(err, pass) {
        if (err) {
            throw err;
        }
        console.log(hej);
        pass = pass.toString();
        console.log('pass',pass,'wpers',web3.personal.unlockAccount);
        // web3.personal.unlockAccount(myAccount, pass, 1000 * 60 * 60 * 24 * 4); //4 days
    });
};

function endWeb3() {
    delete (web3);
    web3 = null;
};

function getContractSource(abi_file, code_file, cb) {
    fs.readFile(abi_file, function read(err, abi_raw) {
        if (err) {
            throw err;
        }
        fs.readFile(code_file, function read(err, code_raw) {
            if (err) {
                throw err;
            }
            cb(err, JSON.parse(abi_raw), code_raw.toString());
        });

    });
};

async function changeJSONFile(file, changeContent, cb) {
    await fs.readFile(file, async function read(err, content) {
        if (err) {
            throw err;
        }
        content = JSON.parse(content);
        await changeContent(content);
        var wstream = fs.createWriteStream(file);
        wstream.write(JSON.stringify(content));
        wstream.end();
        cb(null);
    });
};

function deployContract(name, descr, abi_file, code_file, cb) {

    getContractSource(abi_file, code_file, function (err, abi, code) {
        var iContract = web3.eth.contract(abi);
        var deploy = {from: web3.eth[myAccount], data: code, gas: 2000000};
        var contractPartialInstance = iContract.new("DISQUALIFIED!", deploy);
        var contract = iContract.at(contractPartialInstance.address);

        changeJSONFile(
            deployedContractsFile,
            function (content) {
                var adr = contract.address;
                if (content[adr] === undefined) content[adr] = {};
                content[adr].abi_file = abi_file;
                content[adr].code_file = code_file;
                content[adr].descr = descr;
                content[adr].name = name;
                content[adr].history = [];
                console.log('jsone end');
            },
            function (err) {
                console.log('go');
                cb(err, contract);
            });
    });

};

function contractAtAddress(abi, address, cb) {
    var Contract = web3.eth.contract(abi);
    var contract = Contract.at(address);
    cb(null, contract);
};

function openContract(address, name, cb) {
    fs.readFile(deployedContractsFile, function read(err, content) {
        if (err) {
            throw err;
        }
        content = JSON.parse(content);

        var content_contract;
        if (address !== undefined) {
            content_contract = content[address];
        }
        else {
            for (var adr in content) {
                if (content[adr].name == name) {
                    content_contract = content[adr];
                }
            }
        }

        getContractSource(content_contract.abi_file, content_contract.code_file, function (err, abi, code) {
            contractAtAddress(abi, address, function (err, contract) {
                cb(null, contract);
            });
        });
    });
};

function timeOutIt(cb, times, timeOut) {
    if (times > 0) {
        cb();
        setTimeout(function () {
            timeOutIt(cb, times - 1, timeOut)
        }, timeOut)
    }
};

function contractChange(contract, func, arg) {
    var getData = contract[func].getData(arg);
    var tx = {to: contract.address, from: web3.eth.coinbase, data: getData};
    web3.eth.sendTransaction(tx);

    web3.eth.getBlockNumber(function (err, number) {
        changeJSONFile(
            contractsHistoryFile,
            function (content) {
                var adr = contract.address;
                // add to history
                if (content[adr] === undefined) content[adr] = [];
                content[adr].push({send: number, func: func, arg: arg, tx: tx});
                console.log('jsone end');
            },
            function (err) {
                console.log('go');
            });
    });
};

// module.expo

// openContract('haha',undefined,function (err, val) {
//     console.log(val)
// });

// var name = "haha2", descr = "descroptiono", abi_file = "abi", code_file = "codi";
// changeJSONFile(
//     deployedContractsFile,
//     function (content) {
//         var address = 'adro';
//         if (content[address] === undefined) content[address] = {};
//         content[address].name = name;
//         content[address].descr = descr;
//         content[address].abi_file = abi_file;
//         content[address].code_file = code_file;
//         console.log('jsone end');
//     },
//     function (err) {
//         console.log('go');
//         cb(err, contract);
// });

// getContractSource('sampleContract_sol_SimpleStorage.abi', 'sampleContract_sol_SimpleStorage.bin', (err, abi, code) => {
//     console.log(abi);
//     console.log(code);
// });

module.exports = {
    setWeb3: setWeb3,
    unlockAccount: unlockAccount,
    endWeb3: endWeb3,
    getContractSource: getContractSource,
    changeJSONFile: changeJSONFile,
    deployContract: deployContract,
    contractAtAddress: contractAtAddress,
    openContract: openContract,
    timeOutIt: timeOutIt,
    contractChange: contractChange,
    web3: web3,
};
