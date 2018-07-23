var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
stateDB.blockNumberByHash(stateDB.bufferHex('8a353bc6be86db4a892999fac2d7ffcec56dd29c86b310e520ada975c94f81ca'), function (err, number) {
    console.log('block number: ', number);
    var sampleAdress = stateDB.bufferHex('59B66c66b9159b62DaFCB5fEde243384DFca076D');
    console.log('sample adress:', sampleAdress);
    // var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
    // console.log('hashed adress', buffer);
    stateDB.getStorage(sampleAdress,number, function (err, storage) {
        console.log('storage:', storage);
    });
});

