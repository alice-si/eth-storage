var StateDB = require('../../ethStorage/highLevel.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

for (var i = 0; i < Settings.getRangeTests.length; i++) { // goes through test cases
    var testCase = Settings.getRangeTests[i];
    stateDB.getRange(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newTimeCb(testCase), 'set');
}


