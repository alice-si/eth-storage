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
        console.log('time in milis: ', Date.now() - startTime);
    }
}

function newTimeCb(testCase) {
    var startTime = Date.now();
    return function (err, val) {
        console.log('time in milis:', Date.now() - startTime, '\nmsg:', testCase.msg, '\nvalue:\n', val);
    }
}

// stateDB = new StateDB();

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
    // {
    //     adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
    //     idx: 0,
    //     startBlock: 2700000,
    //     endBlock: 2705000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '5`000 blocks, contract 0xcd56b102... at index 0'
    // },
    // {
    //     adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
    //     idx: 0,
    //     startBlock: 2700000,
    //     endBlock: 2750000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '50`000 blocks, contract 0xcd56b102... at index 0'
    // },

    // {
    //     adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
    //     idx: 0,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 1 (1000 changes to 10000 blocks) at index 0'
    // },
    // {
    //     adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
    //     idx: 0,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 2 (100 changes to 10000 blocks) at index 0'
    // },
    // {
    //     adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
    //     idx: 0,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 3 (10 changes to 10000 blocks) at index 0'
    // },
    // {
    //     adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
    //     idx: 1,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '2000 blocks, sample contract 1 at index 0'
    // },
    // {
    //     adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
    //     idx: 1,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '2000 blocks, sample contract 2 at index 0'
    // },
    // {
    //     adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
    //     idx: 1,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '2000 blocks, sample contract 3 at index 0'
    // },
    // {
    //     adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
    //     idx: 2,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 1 (1000 changes to 10000 blocks) at index 2'
    // },
    // {
    //     adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
    //     idx: 2,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 2 (100 changes to 10000 blocks) at index 2'
    // },
    // {
    //     adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
    //     idx: 2,
    //     startBlock: 2770000,
    //     endBlock: 2790000,
    //     cb: testLog,
    //     expectedOutput: '',
    //     msg: '20000 blocks, samplecontract 3 (10 changes to 10000 blocks) at index 2'
    // },
//
];

module.exports.newAssertCb = newAssertCb;
module.exports.newTimeCb = newTimeCb;
module.exports.getRangeTests = getRangeTests;
