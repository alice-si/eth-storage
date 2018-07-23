var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
stateDB.db.get(new Buffer('LastBlock'), function (err, ltblhash) {
    console.log('last block hash: ', ltblhash);
    stateDB.blockNumberByHash(ltblhash, function (err, number) {
        console.log('last block number: ', number);
        stateDB.blockStateRoot(number, function (err, root) {
            console.log('last block state root:', root);
            var sampleAdress = stateDB.bufferHex('59B66c66b9159b62DaFCB5fEde243384DFca076D');
            console.log('sample adress:', sampleAdress);
            var buffer = stateDB.bufferHex(stateDB.sha3(sampleAdress));
            console.log('hashed adress', buffer);
            stateDB.findTree(root, buffer, function (err, val) {
                console.log('find:', val);
            })
        });
    });

});
