var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
var blhash = stateDB.bufferHex('8a353bc6be86db4a892999fac2d7ffcec56dd29c86b310e520ada975c94f81ca')
console.log('block hash: ', blhash);
stateDB.blockNumberByHash(blhash, function (err, number) {
    console.log('block number: ', number);
    stateDB.blockStateRoot(number, function (err, root) {
        console.log('block state root:', root);
        var sampleAdress = stateDB.bufferHex('59B66c66b9159b62DaFCB5fEde243384DFca076D');
        console.log('sample adress:', sampleAdress);
        var buffer = stateDB.bufferHex(stateDB.sha3(sampleAdress));
        console.log('hashed adress', buffer);
        stateDB.find(root, buffer, 0, function (err, val) {
            console.log('find:', val);
        })
    });
});

