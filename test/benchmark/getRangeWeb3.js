var StateDB = require('./../../benchmark.js');
var Settings = require('./../settings.js');


for (var i = 0; i < Settings.getRangeTests.length; i++) { // goes through test cases
    var testCase = Settings.getRangeTests[i];
    StateDB.getRange(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newTimeCb(testCase));
}


