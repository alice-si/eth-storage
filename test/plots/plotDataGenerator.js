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

var displayResult = function (method, testCase, testIdx) {
    var n = testIdx;
    console.log(method, ': test case ' + (+testIdx + 1) + ' "' + testCase.msg + '",' + ' (iterations ' + numberOfExecutions + ' searched in ' + (testCase.endBlock - testCase.startBlock) + ' blocks):')
    var results = t.timers[method + testIdx];

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

var runTestCase = async function (name, tc, testCase, threads, method, txReading) {
    await runExample(name, tc, function (cb) {
        stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, threads, method, txReading);
    });
    await displayResult(name, testCase, tc);
};

async function benchmark(tests, name) {

    var testName = '4methods';

    for (var j = 0; j < tests.length; j++) { // goes through test case

        var testCase = tests[j];
        console.log('Started test case ' + (j + 1) + ', message: "' + testCase.msg + '"\n');

        // for (var i = 16; i > 0; i = Math.floor(i/2)) {
        // var yn = await readlineSync.question("Have you turned on web3 api?");
        // await process.stdin.on('data', async function (data) {
        //     await console.log(data);
        // });
        var n = prompt('Have you turned web3 api on?');
        await console.log('ok');


        await runExample('web3 ts '+j, testName, function (cb) {
            StateDBWeb3.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb);
        });
        await displayResult('web3 ts '+j, testCase, testName);
        // }


        // tested methods and plot names
        var n = prompt('Have you turned web3 api offffffffffffffffffffffffffffff?');
        await console.log('ok');
        stateDB = new StateDB(Settings.dbPath);

        await runTestCase('n=' + 1 + ' hashset n=1 ts '+j, testName, testCase, 1, 'hashSet', true);
        await runTestCase('n=' + 1 + ' set n=1 ts '+j, testName, testCase, 1, 'set', true);
        await runTestCase('n=' + 1 + ' lastPath n=1 ts '+j, testName, testCase, 1, 'lastPath', true);

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




