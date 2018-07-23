var Trie = require('../../merkle-patricia-tree');
var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
var sampleAdress = stateDB.bufferHex('458dFB3A8457451c7e40403e9C065f05F419f02c');
var number = stateDB.bufferHex('0000000000288a88');
console.log('sample adress:', sampleAdress);
// var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
// console.log('hashed adress', buffer);
stateDB.getStorageTree(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
    console.log('its storage 2 ',storage[2])
    stateDB.showPaths(storage[2],"");
});
