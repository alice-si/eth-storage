var StateDB = require('../../ethStorage/layers/highLevel.js');
var Settings = require('../settings.js');

console.log(Settings.dbPath,true);
var stateDB = new StateDB(Settings.dbPath,true);

// stateDB.latestHeaderHash(console.log)
// stateDB.latestHeaderNumber(console.log)

async function last() {
    var result = await stateDB.promiseLastFullBlock()
    console.log('result ',result)
}

last()

// for (var i = 0; i < 1 && i < Settings.getRangeTests2.length; i++) { // goes through test cases
//     var testCase = Settings.getRangeTests2[i];
//     console.log(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock, Settings.newTimeCb(testCase));
//     stateDB.promiseGetRange(testCase.adr, testCase.idx, testCase.startBlock, testCase.endBlock)
//         .then(console.log)
// }

setTimeout(function (){
    stateDB.free();
},15*1000);



