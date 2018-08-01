var assert = require('assert');
var Benchmark = require('./../benchmark.js');
var Settings = require('./settings.js');


for (var i = 0; i < Settings.getRangeTestsSampleContract.length; i++) {
    var testCase = Settings.getRangeTestsSampleContract[i];
    var cb = testCase.cb;
    var output = testCase.expectedOutput;
    Benchmark.getRange(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newAssertCb(testCase));
}


// stateDB.getRange(testCase.adr,testCase.idx,testCase.startBlock,testCase.endBlock,testCase.cb)
