var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
var number = stateDB.bufferHex('0000' + '0000' + '000' + 'F4240');
console.log('sample adress:', sampleAdress);
stateDB.getStorage(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
});
