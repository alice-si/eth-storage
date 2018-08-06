var StateDB = require('../../ethStorage.js');
var Settings = require('./../settings.js');

const t = require('exectimer');
const Tick = t.Tick;

var stateDB = new StateDB(Settings.dbPath);

var numberOfExecutions = 5;

var arr = [];
for (var i = 0; i < Settings.getRangeTests.length; i++) { // goes through test cases
    arr.pop();
    arr.push(i);
    for (var j = 0; j < numberOfExecutions; j++) {
        Tick.wrap(function getRangeMulti8HashSet(done) {
            var testCase = Settings.getRangeTests[arr[0]];
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, function (err, val) {
                    done();
                }, 8
            );
        });
    }
    for (var j = 0; j < numberOfExecutions; j++) {
        Tick.wrap(function getRangeMulti8LastPath(done) {
            var testCase = Settings.getRangeTests[arr[0]];
            stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, function (err, val) {
                done();
            }, 8, 'lastPath');
        });

    }
}

// Display the results
console.log('getRangeMutlti8HashSet:');
console.log('duration',t.timers.getRangeMulti8HashSet.duration()); // total duration of all ticks
console.log('min',t.timers.getRangeMulti8HashSet.min()); // minimal tick duration
console.log('max',t.timers.getRangeMulti8HashSet.max()); // maximal tick duration
console.log('mean',t.timers.getRangeMulti8HashSet.mean()); // mean tick duration
console.log('median',t.timers.getRangeMulti8HashSet.median()); // median tick duration

console.log('getRangeMutlti8HashSet:');
console.log('duration',t.timers.getRangeMulti8LastPath.duration()); // total duration of all ticks
console.log('min',t.timers.getRangeMulti8LastPath.min()); // minimal tick duration
console.log('max',t.timers.getRangeMulti8LastPath.max()); // maximal tick duration
console.log('mean',t.timers.getRangeMulti8LastPath.mean()); // mean tick duration
console.log('median',t.timers.getRangeMulti8LastPath.median()); // median tick duration




