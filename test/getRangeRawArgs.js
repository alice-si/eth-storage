var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
console.log('sample adress:', sampleAdress);
var number = stateDB.buffer64(1117760);
var number2 = stateDB.buffer64(1117810);
var index = stateDB.buffer256(0);

stateDB.getRange(sampleAdress, index, number, number2, function (err, storage) {
    console.log('storage at index(', index, '):\n', storage);
});

/*
sample adress: <Buffer 6b ad c9 46 3c 5c c9 1c bf b5 17 6e f9 9a 45 4c 3c 77 b0 0e>
storage at index( <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00> ):
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>, val: <Buffer 02> },
  { block: <Buffer 00 00 00 00 00 11 0e 69>, val: <Buffer 03> } ]
 */