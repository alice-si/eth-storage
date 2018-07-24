var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.getMultiple("6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    1117760, // start block
    1117810, //end block
    0, // index
    5, // step
    function (err, storage) {
        console.log('storage at index:\n', storage);
    });
