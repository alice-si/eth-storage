const fs = require('fs');
var Web3 = require('web3');

var web3;

var deployedContractsFile = 'deployedContracts.json';
var contractsHistoryFile = 'contractsHistory.json';

export async function setWeb3(){
    web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};

export async function unlockAccount(){
    await fs.readFile('accountData', async function read(err, pass) {
        if (err) {
            throw err;
        }
        pass = pass.toString();
        await web3.eth.personal.unlockAccount(web3.eth.coinbase,pass,1000*60*60*24*4); //4 days
    });
};

export function endWeb3() {
    web3 = null;
};

export function getContractSource(abi_file, code_file, cb) {
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

export async function changeJSONFile(file, changeContent, cb) {
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

export function deployContract(name, descr, abi_file, code_file, cb) {

    getContractSource(abi_file, code_file, function (err, abi, code) {
        var Contract = eth.contract(abi);
        var deploy = {from: eth.coinbase, data: code, gas: 2000000};
        var contractPartialInstance = Contract.new("DISQUALIFIED!", deploy);
        var contract = Contract.at(contractPartialInstance.address);

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

export function contractAtAddress(abi, address, cb) {
    var Contract = eth.contract(abi);
    var contract = Contract.at(address);
    cb(null, contract);
};

export function openContract(address, name, cb) {
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

export function timeOutIt(cb, times, timeOut) {
    if (times > 0) {
        cb();
        setTimeout(function () {
            timeOutIt(cb, times - 1, timeOut)
        }, timeOut)
    }
};

export function contractChange(contract, func, arg) {
    var getData = contract[func].getData(arg);
    var tx = {to: contract.address, from: eth.coinbase, data: getData};
    web3.eth.sendTransaction(tx);

    web3.eth.getBlockNumber(function(err,number){
        changeJSONFile(
            contractsHistoryFile,
            function (content) {
                var adr = contract.address;
                // add to history
                if (content[adr] === undefined) content[adr] = [];
                content[adr].push({send: number, func: func, arg:arg, tx:tx});
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

