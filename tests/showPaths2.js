var Trie = require('../../merkle-patricia-tree');
var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
var sampleAdress = stateDB.bufferHex('9fA6c84291D25E7Ef6cb9Ed540cc1aa75a10464B');
var number = stateDB.bufferHex('0000000000288a88');
console.log('sample adress:', sampleAdress);
// var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
// console.log('hashed adress', buffer);
stateDB.getStorage(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
    console.log('its storage 2 ',storage[2])
    stateDB.showPaths(storage[2],"");
});
