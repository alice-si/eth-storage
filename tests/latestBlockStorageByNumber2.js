var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
var sampleAdress = stateDB.hashBuffer('59B66c66b9159b62DaFCB5fEde243384DFca076D');
var number = stateDB.hashBuffer('0000000000288a88');
console.log('sample adress:', sampleAdress);
// var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
// console.log('hashed adress', buffer);
stateDB.storage(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
});
