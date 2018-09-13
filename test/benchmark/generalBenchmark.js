var StateDB = require('../../ethStorage/highLevel.js');
var Settings = require('./../settings.js');

const t = require('exectimer');
const Tick = t.Tick;

var stateDB = new StateDB(Settings.dbPath);

var numberOfExecutions = 10;

var displayResult = function (name, testCase) {

    console.log('timer name:',name, 'test case msg:',testCase.msg,
        '(iterations:',numberOfExecutions,' searched in range:',(testCase.endBlock - testCase.startBlock),'blocks)');

    var results = t.timers[name];
    console.log('duration', results.parse(
        results.duration()
    )); // total duration of all ticks
    console.log('min', results.parse(
        results.min()
    ));      // minimal tick duration
    console.log('max', results.parse(
        results.max()
    ));      // maximal tick duration
    console.log('mean', results.parse(
        results.mean()
    ));     // mean tick duration
    console.log('median', results.parse(
        results.median()
    ), '\n');   // median tick duration
};

async function runExample(name, cb) {
    for (var i = 0; i < numberOfExecutions; i++) {
        await new Promise(function (resolve, reject) {
            Tick.wrap(name, function (done) {
                cb(function () {
                    done();
                    resolve();
                })
            })
        })
    }
}

var tname = 'sample test';

async function benchmark() {
    for (var j = 0; j < Settings.getRangeTests.length; j++) { // goes through test case

        var testCase = Settings.getRangeTests[j];

        console.log('Started test case ' + (j + 1) + ', message: "'+testCase.msg+'"\n');

        await runExample(tname+j,function (cb) {
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, 8);
        });

        displayResult(tname+j,testCase);
    }
}

// run benchmark
benchmark();




