var assert = require('assert');

var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

// var stateDB = new StateDB('./../geth/chaindata');
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
console.log('sample adress:', sampleAdress);
var number = stateDB.buffer64(1000000);
console.log('blocknumber',number);
var index = stateDB.buffer256(1);
console.log('index',index);

stateDB.getVariable(sampleAdress,number,index,function (err, variable) {
    console.log('getVariable:variable',variable);
});

/*
sample adress: <Buffer 6b ad c9 46 3c 5c c9 1c bf b5 17 6e f9 9a 45 4c 3c 77 b0 0e>
blocknumber <Buffer 00 00 00 00 00 0f 42 40>
index <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01>
getVariable:variable <Buffer 02>
 */