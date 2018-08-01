// var dbPath = './../geth/chaindata';
var dbPath = 'C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata';

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
        // console.log(msg,'not equal:\n1) ',JSON.stringify(o1).split(50),'2) ',JSON.stringify(o2).split(50))
    }
}

function newAssertCb(testCase) {
    var startTime = Date.now();
    return function (err, val) {
        myAssertEqual(testCase.cb(err, val), testCase.expectedOutput, testCase.msg);
        console.log('time in milis: ',Date.now() - startTime);
    }
}

var getRangeTests = [
    // {
    //     adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    //     idx: 1,
    //     startBlock: 1117500,
    //     endBlock: 1118000,
    //     cb: testLog,
    //     expectedOutput: 'null\n' +
    //     '[{"block":{"type":"Buffer","data":[0,0,0,0,0,17,13,60]},"val":{"type":"Buffer","data":[2]}},{"block":{"type":"Buffer","data":[0,0,0,0,0,17,14,105]},"val":{"type":"Buffer","data":[3]}}]\n',
    //     msg: 'basic test 500 blocks'
    // },
    // {
    //     adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    //     idx: 4,
    //     startBlock: 1117500,
    //     endBlock: 1118000,
    //     cb: testLog,
    //     expectedOutput: 'null\n' +
    //     '[{"block":{"type":"Buffer","data":[0,0,0,0,0,17,13,60]},"val":{"type":"Buffer","data":[59,48,200,181,167,77,47,220,140,70,102,234,34,180,13,162,172,146,46,223]}}]\n',
    //     msg: 'basic test 500 blocks'
    // },
    {
        adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
        idx: 1,
        startBlock: 1110000,
        endBlock: 112000,
        cb: testLog,
        expectedOutput: 'null\n' +
        '[{"block":{"type":"Buffer","data":[0,0,0,0,0,17,13,60]},"val":{"type":"Buffer","data":[2]}},{"block":{"type":"Buffer","data":[0,0,0,0,0,17,14,105]},"val":{"type":"Buffer","data":[3]}}]\n',
        msg: 'search in 10000 blocks'

    },
    // {
    //     adr: "6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    //     idx: 4,
    //     startBlock: 1110000,
    //     endBlock: 1120000,
    //     cb: testLog,
    //     expectedOutput: 'null\n' +
    //     '[{"block":{"type":"Buffer","data":[0,0,0,0,0,16,239,240]},"val":{"type":"Buffer","data":[59,48,200,181,167,77,47,220,140,70,102,234,34,180,13,162,172,146,46,223]}}]',
    //     msg: 'search in 10000 blocks'
    // }
];

module.exports.newAssertCb = newAssertCb;
module.exports.getRangeTests = getRangeTests;