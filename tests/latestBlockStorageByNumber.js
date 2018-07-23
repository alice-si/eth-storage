var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
// var stateDB = new StateDB('C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata');
stateDB.db.get(new Buffer('LastBlock'), function (err, ltblhash) {
    console.log('last block hash: ', ltblhash);
    stateDB.blockNumberByHash(ltblhash, function (err, number) {
        console.log('last block number: ', number);
        var sampleAdress = stateDB.bufferHex('59B66c66b9159b62DaFCB5fEde243384DFca076D');
        console.log('sample adress:', sampleAdress);
        // var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
        // console.log('hashed adress', buffer);
        stateDB.getStorage(sampleAdress,number, function (err, storage) {
            console.log('storage:', storage);
        });
    });

});
