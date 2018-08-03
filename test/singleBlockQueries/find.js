var StateDB = require('../../stateSingleQueries.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');

stateDB.getStorage('6badc9463c5cc91cbfb5176ef99a454c3c77b00e', 0xF4240, function (err, storage) {
    console.log('storage:', storage);
});

stateDB.blockStateRoot(0xF4240,function (err, val) {
    stateDB.find(val,stateDB.sha3(sampleAdress),function (err,val) {
        console.log('find:',val)
    });
});
