var StateDB = require('../../ethStorage.js');
var prompt = require('prompt-sync')();
// var readlineSync = require('readline-sync');
var StateDBWeb3 = require('../../getRangeWeb3.js');
var Settings = require('../settings.js');
var dtg = require('./dataToGenerate');

const t = require('exectimer');
const Tick = t.Tick;

// var stateDB = new StateDB(Settings.dbPath);

var numberOfExecutions = 10;
var stateDB;


var resultsArr = {};

var displayResult = function (timerName, testCase, testName) {
    var method = timerName;
    var testIdx = testName;
    var n = testName;
    console.log(method, ': test case ' + (+testIdx + 1) + ' "' + testCase.msg + '",' + ' (iterations ' + numberOfExecutions + ' searched in ' + (testCase.endBlock - testCase.startBlock) + ' blocks):')
    var results = t.timers[method];

    console.log('result raw');
    if (resultsArr[n] === undefined) {
        resultsArr[n] = {};
    }


    if (resultsArr[n].duration === undefined) resultsArr[n].duration = [];
    resultsArr[n].duration.push({name: method, msg: testCase.msg, val: results.duration()});
    if (resultsArr[n].min === undefined) resultsArr[n].min = [];
    resultsArr[n].min.push({name: method + testCase.msg, val: results.min()});
    if (resultsArr[n].max === undefined) resultsArr[n].max = [];
    resultsArr[n].max.push({name: method + testCase.msg, val: results.max()});
    if (resultsArr[n].mean === undefined) resultsArr[n].mean = [];
    resultsArr[n].mean.push({name: method + testCase.msg, val: results.mean()});
    if (resultsArr[n].median === undefined) resultsArr[n].median = [];
    resultsArr[n].median.push({name: method + testCase.msg, val: results.median()});

    console.log('duration', results.parse(
        results.duration()
    ));
    // total duration of all ticks
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

async function runExample(timerName, cb) {
    for (var i = 0; i < numberOfExecutions; i++) {
        await new Promise(function (resolve, reject) {
            Tick.wrap(timerName, function (done) {
                cb(function () {
                    done();
                    resolve();
                })
            })
        })
    }
}

var runTestCaseGetRangeMulti = async function (timerName, testName, testCase, threads, method, txReading) {
    await runExample(timerName, function (cb) {
        stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, threads, method, txReading);
    });
    await displayResult(timerName, testCase, testName);
};

var runTestCaseWeb3API = async function (timerName, testName, testCase) {
    await runExample(timerName, function (cb) {
        StateDBWeb3.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb);
    });
    await displayResult(timerName, testCase, testName);
};

async function benchmark(tests, name) {

    var testName = '4methods';

    for (var j = 0; j < tests.length; j++) { // goes through test case

        var testCase = tests[j];
        console.log('Started test case ' + j + ', message: "' + testCase.msg + '"\n');

        var n = prompt('Have you turned web3 api on?');
        await console.log('ok');

        // run web3 api getrange
        await runTestCaseWeb3API('web3 ts '+j, testName, testCase);

        // tested methods and plot names
        var n = prompt('Have you turned web3 api offffffffffffffffffffffffffffff?');
        await console.log('ok');

        stateDB = new StateDB(Settings.dbPath);

        // run getrange
        await runTestCaseGetRangeMulti('n=' + 1 + ' hashset  ts '+j, testName, testCase, 1, 'hashSet', true);
        await runTestCaseGetRangeMulti('n=' + 1 + ' set ts '+j, testName, testCase, 1, 'set', true);
        await runTestCaseGetRangeMulti('n=' + 1 + ' lastPath ts '+j, testName, testCase, 1, 'lastPath', true);

        stateDB.free();
        stateDB = null;

    }
    // save results
    var fs = require('fs');
    fs.writeFile(name, JSON.stringify(resultsArr), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

// run benchmark
benchmark(dtg.cases, '4methodsComparisionResults2.json');




