var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
var number = stateDB.bufferHex('0000' + '0000' + '000' + 'F4240');

stateDB.getStorage(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
});

stateDB.blockStateRoot(0xF4240,function (err, val) {
    stateDB.find(val,stateDB.sha3(sampleAdress),function (err,val) {
        console.log('find:',val)
    });
});
