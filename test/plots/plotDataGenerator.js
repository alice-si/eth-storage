var prompt = require('prompt-sync')();
var fs = require('fs');

var StateDB = require('../../ethStorage.js');
var StateDBWeb3 = require('../../getRangeWeb3.js');
var Settings = require('../settings.js');
var dtg = require('./dataToGenerate');

const t = require('exectimer');
const Tick = t.Tick;

// var stateDB = new StateDB(Settings.dbPath);

var inputFileName = 'testResults.json';
var outputFileName = 'testResults.json';

var numberOfExecutions = 10;
var stateDB;


var resultsArr = {};

var displayResult = function (timerName, testCase, params) {

    var rangeLen = testCase.endBlock - testCase.startBlock;

    console.log('timer name:',timerName, 'test case msg:',testCase.msg,
        '(iterations:',numberOfExecutions,' searched in range:',rangeLen,'blocks)');

    var results = t.timers[timerName];

    var newResult = {};
    newResult.timerName = timerName;
    newResult.executions = numberOfExecutions;
    newResult.params = params;
    newResult.testCase = testCase;

    var res ={};
    res.duration = results.duration();
    res.min = results.min();
    res.max = results.max();
    res.mean = results.mean();
    res.median = results.median();

    newResult.results = res;

    if (resultsArr[rangeLen] === undefined) resultsArr[rangeLen] = [];

    resultsArr[rangeLen].push(newResult);

    console.log('added new result:',newResult);

    // console.log('duration', results.parse(
    //     results.duration()
    // ));
    // total duration of all ticks
    // console.log('min', results.parse(
    //     results.min()
    // ));      // minimal tick duration
    // console.log('max', results.parse(
    //     results.max()
    // ));      // maximal tick duration
    // console.log('mean', results.parse(
    //     results.mean()
    // ));     // mean tick duration
    // console.log('median', results.parse(
    //     results.median()
    // ), '\n');   // median tick duration
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

var runTestCaseGetRangeMulti = async function (timerName, testCase, threads, method, txReading) {

    stateDB = new StateDB(Settings.dbPath);

    var params = {threads:threads,method:method,txReading:txReading};

    await runExample(timerName, function (cb) {
        stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, threads, method, txReading);
    });
    await displayResult(timerName, testCase, params);

    stateDB.free();
    stateDB = null;
};

var runTestCaseWeb3API = async function (timerName,threads, testCase) {

    var n = prompt('Have you turned web3 api on?');
    await console.log('ok');

    var params = {threads:threads,method:'web3',txReading:txReading};

    await runExample(timerName, function (cb) {
        StateDBWeb3.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, threads);
    });
    await displayResult(timerName, testCase, params);

    n = prompt('Have you turned web3 api of?');
    await console.log('ok');

};

async function benchmark(tests, name) {

    var testName = '4 methods comparision';

    for (var j = 0; j < tests.length; j++) { // goes through test case

        var testCase = tests[j];
        console.log('Started test case ' + j + ', message: "' + testCase.msg + '"\n');


        // run web3 api getrange
        // await runTestCaseWeb3API(timerName+'(web3)', 1, testCase);

        // run getRange
        await runTestCaseGetRangeMulti('hashSet,n=1,'+j, testCase, 1, 'hashSet', true);
        await runTestCaseGetRangeMulti('set,n=1,'+j, testCase, 1, 'set', true);
        await runTestCaseGetRangeMulti('lastPath,n=1,'+j, testCase, 1, 'lastPath', true);

        await runTestCaseGetRangeMulti('hashSet,n=2,'+j, testCase, 2, 'hashSet', true);
        await runTestCaseGetRangeMulti('set,n=2,'+j, testCase, 2, 'set', true);
        await runTestCaseGetRangeMulti('lastPath,n=2,'+j, testCase, 2, 'lastPath', true);

        await runTestCaseGetRangeMulti('hashSet,n=4,'+j, testCase, 4, 'hashSet', true);
        await runTestCaseGetRangeMulti('set,n=4,'+j, testCase, 4, 'set', true);
        await runTestCaseGetRangeMulti('lastPath,n=4,'+j, testCase, 4, 'lastPath', true);

        await runTestCaseGetRangeMulti('hashSet,n=8,'+j, testCase, 8, 'hashSet', true);
        await runTestCaseGetRangeMulti('set,n=8,'+j, testCase, 8, 'set', true);
        await runTestCaseGetRangeMulti('lastPath,n=8,'+j, testCase, 8, 'lastPath', true);

    }

    // save results
    fs.writeFile(name, JSON.stringify(resultsArr,null,2), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

fs.readFile(inputFileName, async function read(err, content) {
    if (err) {
        throw err;
    }
    resultsArr = JSON.parse(content);
    // run benchmark
    benchmark(dtg.cases, outputFileName);
});




