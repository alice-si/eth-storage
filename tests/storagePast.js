var StateDB = require('./../state.js');
var stateDB = new StateDB('C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata');
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
var number = stateDB.bufferHex('0000' +
    '0000' +
    '000' +
    'F4240');
console.log('sample adress:', sampleAdress);
// console.log('stadeb',stateDB)
// var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
// console.log('hashed adress', buffer);
stateDB.getStorage(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
});
