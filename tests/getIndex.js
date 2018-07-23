var Trie = require('../../merkle-patricia-tree');
var StateDB = require('./../state.js');

var stateDB = new StateDB('./../geth/chaindata');
var sampleAdress = stateDB.bufferHex('458dFB3A8457451c7e40403e9C065f05F419f02c');
console.log('sample adress:', sampleAdress);
var number = stateDB.bufferHex('0000000000288a88');
var index = stateDB.bufferHex(
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000001');

stateDB.getVariable(sampleAdress,number,index,function (err, variable) {
    console.log('getVariable:variable',variable);
});
