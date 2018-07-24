var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.getVariable('6badc9463c5cc91cbfb5176ef99a454c3c77b00e', 0xF4240, 4, function (err, storage) {
    console.log('1) storage at index:', storage);
});

stateDB.getVariable('6badc9463c5cc91cbfb5176ef99a454c3c77b00e', '0xF4240', 4, function (err, storage) {
    console.log('2) storage at index :', storage);
});

