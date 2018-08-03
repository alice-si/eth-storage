var StateDB = require('../../stateHashSet.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
console.log('sample adress:', sampleAdress);
var number = stateDB.bufferHex('0000' + '0000' + '000' + 'F4240');
var index = stateDB.buffer256(4);

stateDB.getVariable(sampleAdress, index, number, function (err, storage) {
    console.log('storage at index:', storage);
});
