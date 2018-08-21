var StateDB = require('../../ethStorage.js');
var Settings = require('../settings.js');

const t = require('exectimer');
const Tick = t.Tick;

var stateDB = new StateDB(Settings.dbPath);

var numberOfExecutions = 5;


var resultsArr = {};

var displayResult = function (method, testCase, testIdx) {
    var n = testIdx;
    console.log(method, ': test case ' + (+testIdx + 1) + ' "'+ testCase.msg+'",'+ ' (iterations ' + numberOfExecutions + ' searched in ' + (testCase.endBlock - testCase.startBlock) + ' blocks):')
    var results = t.timers[method + testIdx];

    console.log('result raw');
    if (resultsArr[n] === undefined) resultsArr[n] = {};

    if (resultsArr[n].duration === undefined) resultsArr[n].duration = [];

    resultsArr[n].duration.push({name:method+testCase,val:results.duration()});

    console.log('duration', results.parse(
        results.duration()
    ));
    // total duration of all ticks
    // results[n].min = results.min();
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

async function runExample(name, j, cb) {
    for (var i = 0; i < numberOfExecutions; i++) {
        await new Promise(function (resolve, reject) {
            Tick.wrap(name + j, function (done) {
                cb(function () {
                    done();
                    resolve();
                })
            })
        })
    }
}

async function benchmark() {
    for (var j = 0; j < 1 && j < Settings.getRangeTests.length; j++) { // goes through test case

        var testCase = Settings.getRangeTests[j];
        console.log('Started test case ' + (j + 1) + ', message: "'+testCase.msg+'"\n');

        await runExample('getRangeMulti8HashSet', j, function (cb) {
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, 8);
        });

        displayResult('getRangeMulti8HashSet', testCase, j);

        await runExample('getRangeMulti8LastPath', j, function (cb) {
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, 8, 'lastPath');
        });


        displayResult('getRangeMulti8LastPath', testCase, j);

        await runExample('getRangeMulti8Set', j, function (cb) {
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, 8, 'set');
        });


        displayResult('getRangeMulti8Set', testCase, j);

        await runExample('getRangeMulti100HashSet', j, function (cb) {
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, 4);
        });

        displayResult('getRangeMulti100HashSet', testCase, j);
    }
    // save results
    var fs = require('fs');
    fs.writeFile("results.json", JSON.stringify(resultsArr), function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// run benchmark
benchmark();




