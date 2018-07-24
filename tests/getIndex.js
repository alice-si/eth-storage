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
