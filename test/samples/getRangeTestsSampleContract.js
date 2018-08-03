var assert = require('assert');
var StateDB = require('../../stateHashSet.js');
var Settings = require('../settings.js');


var stateDB = new StateDB(Settings.dbPath);
for (var i = 0; i < Settings.getRangeTestsSampleContract.length; i++) {
    var testCase = Settings.getRangeTestsSampleContract[i];
    var cb = testCase.cb;
    var output = testCase.expectedOutput;
    stateDB.getRange(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newAssertCb(testCase));
}


// stateDB.getRange(testCase.adr,testCase.idx,testCase.startBlock,testCase.endBlock,testCase.cb)