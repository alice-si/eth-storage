var StateDB = require('../../ethStorage.js');
var StateDBWeb3 = require('../../getRangeWeb3.js');
var Settings = require('../settings.js');
var dtg = require('./dataToGenerate');

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
    if (resultsArr[n] === undefined){
        resultsArr[n] = {};
    }


    if (resultsArr[n].duration === undefined) resultsArr[n].duration = [];
    resultsArr[n].duration.push({name:method,msg:testCase.msg,val:results.duration()});
    if (resultsArr[n].min === undefined) resultsArr[n].min = [];
    resultsArr[n].min.push({name:method+testCase.msg,val:results.min()});
    if (resultsArr[n].max === undefined) resultsArr[n].max = [];
    resultsArr[n].max.push({name:method+testCase.msg,val:results.max()});
    if (resultsArr[n].mean === undefined) resultsArr[n].mean = [];
    resultsArr[n].mean.push({name:method+testCase.msg,val:results.mean()});
    if (resultsArr[n].median === undefined) resultsArr[n].median = [];
    resultsArr[n].median.push({name:method+testCase.msg,val:results.median()});

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

var runTestCase = async function(name,tc,testCase,threads,method,txReading){
    await runExample(name, tc, function (cb) {
        stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, threads,method,txReading);
    });
    await displayResult(name, testCase, tc);
};

async function benchmark(tests,name) {
    for (var j = 0; j < tests.length; j++) { // goes through test case

        var testCase = tests[j];
        console.log('Started test case ' + (j + 1) + ', message: "'+testCase.msg+'"\n');

        // for (var i = 16; i > 0; i = Math.floor(i/2)) {
        //     await runExample('web3APIgetBlocksIndependent', 'web3 n= '+i+' testcase '+j , function (cb) {
        //         StateDBWeb3.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, cb, i);
        //     });
        //     await displayResult('web3APIgetBlocksIndependent', testCase, j);
        // }


        // tested methods and plot names

        for (var i = 16; i > 0; i--){
            await runTestCase('n='+i+' hashset tx reading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'hashSet',true);
            await runTestCase('n='+i+' hashset no tx reading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'hashSet',false);
            await runTestCase('n='+i+' set tx reading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'set',true);
            await runTestCase('n='+i+' set tx no reading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'set',false);
            await runTestCase('n='+i+' lastPath tx reading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'lastPath',true);
            await runTestCase('n='+i+' lastPAth no txReading','hashSet vs Set vs LastPath with tx reading and no tx reading '+j,testCase,i,'lastPath',false);
        }

    }
    // save results
    var fs = require('fs');
    fs.writeFile(name, JSON.stringify(resultsArr), function(err) {
        if (err) {
            console.log(err);
        }
    });
}

// run benchmark
benchmark(dtg.cases,'txReadingVsNotxReading.json');




