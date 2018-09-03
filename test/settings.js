// var dbPath = 'C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata';  // database path
var dbPath = 'C:\\Users\\ja1\\AppData\\Local\\Parity\\Ethereum\\chains\\ethereum\\db\\906a34e69aec8c0d\\overlayrecent\\db';  // database path
// var dbPath = '/home/ubuntu/.local/share/io.parity.ethereum/chains/ethereum/db/906a34e69aec8c0d/overlayrecent/db';  // database path

var dtg = require('./plots/dataToGenerate');

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
        console.log('time in milis: ', Date.now() - startTime);
    }
}

function newTimeCb(testCase) {
    var startTime = Date.now();
    return function (err, val) {
        console.log('time in milis:', Date.now() - startTime, '\nmsg:', testCase.msg, '\nvalue:\n', val);
        // console.log('val tail',val.slice(val.length - 10,val.length))
    }
}

// stateDB = new StateDB();

var getRangeTests = [

    {
        adr: "0xBd897c8885b40d014Fb7941B3043B21adcC9ca1C",
        idx: 0,
        startBlock: 4724262,
        endBlock: 4725262,
        msg: 'Alice contract'
    },

];

module.exports.newAssertCb = newAssertCb;
module.exports.newTimeCb = newTimeCb;
module.exports.getRangeTests = getRangeTests;
// module.exports.getRangeTests = dtg.cases;
module.exports.getRangeTests2 = dtg.cases2;
