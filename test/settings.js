var StateDB = require('../stateHashSet.js');
var dbPath = 'C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata';  // database path

module.exports.dbPath = dbPath;
module.exports.myAssertEqual = myAssertEqual;

function testLog() {
    var output = '';
    for (var i = 0; i < arguments.length; i++) {
        output += JSON.stringify(arguments[i]) + '\n';
    }
    return output;
}

function myAssertEqual(o1, o2, msg) {
    if (o1 === o2) {
        console.log(msg, '- assert passed');
    }
    else {
        console.log(msg, '- not equal:\n1)\n', o1, '2)\n', o2);
    }
}

function newAssertCb(testCase) {
    var startTime = Date.now();
    return function (err, val) {
        myAssertEqual(testCase.cb(err, val), testCase.expectedOutput, testCase.msg);
        console.log('time in milis: ',Date.now() - startTime);
    }
}

function newTimeCb(testCase) {
    var startTime = Date.now();
    return function (err, val) {
        console.log('time in milis:',Date.now() - startTime,'\nmsg:',testCase.msg,'\nvalue:\n',val);
    }
}

stateDB = new StateDB();

var getRangeTests = [
    {
        adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
        idx: 0,
        startBlock: 2700000,
        endBlock: 2700500,
        cb: testLog,
        expectedOutput: '',
        msg: '500 blocks, contract 0xcd56b102... at index 0'
    },
    {
        adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
        idx: 0,
        startBlock: 2700000,
        endBlock: 2705000,
        cb: testLog,
        expectedOutput: '',
        msg: '5`000 blocks, contract 0xcd56b102... at index 0'
    },
    {
        adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
        idx: 0,
        startBlock: 2700000,
        endBlock: 2750000,
        cb: testLog,
        expectedOutput: '',
        msg: '50`000 blocks, contract 0xcd56b102... at index 0'
    },
];

module.exports.newAssertCb = newAssertCb;
module.exports.newTimeCb = newTimeCb;
module.exports.getRangeTests = getRangeTests;
