var StateDB = require('../../ethStorage/layers/highLevel.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath,true);

for (var i = 0; i < 1 && i < Settings.getRangeTests2.length; i++) { // goes through test cases
    var testCase = Settings.getRangeTests2[i];
    stateDB.getRangeMulti(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newTimeCb(testCase),8);
}

setTimeout(function (){
    stateDB.free();
},20*1000);

