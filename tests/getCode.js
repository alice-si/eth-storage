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

stateDB.getCode(sampleAdress,number,function (err,code) {
    console.log('itscode',code);
    console.log('itscode.string',code.toString('utf-8'));
});
