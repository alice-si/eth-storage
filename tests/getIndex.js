var assert = require('assert');

var Trie = require('../../merkle-patricia-tree');
var StateDB = require('./../state.js');

// var stateDB = new StateDB('./../geth/chaindata');
var stateDB = new StateDB('C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata');
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
console.log('sample adress:', sampleAdress);
var number = stateDB.buffer64(1000000);
console.log('blocknumber',number);
var index = stateDB.buffer256(1);
console.log('index',index);

stateDB.getVariable(sampleAdress,number,index,function (err, variable) {
    console.log('getVariable:variable',variable);
});
