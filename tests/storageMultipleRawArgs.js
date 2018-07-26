var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
console.log('sample adress:', sampleAdress);
var number = stateDB.buffer64(1117760);
var number2 = stateDB.buffer64(1117810);
var index = stateDB.buffer256(0)

stateDB.getRange(sampleAdress, number, number2, index, function (err, storage) {
    console.log('storage at index(',index,'):\n', storage);
});

