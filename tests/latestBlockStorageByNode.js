var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
stateDB.db.get(new Buffer('LastBlock'), function (err, ltblhash) {
    console.log('last block hash: ', ltblhash);
    stateDB.blockNumberByHash(ltblhash, function (err, number) {
        console.log('last block number: ', number);
        stateDB.blockStateRoot(number, function (err, root) {
            console.log('last block state root:', root);
            var sampleAdress = stateDB.hashBuffer('59B66c66b9159b62DaFCB5fEde243384DFca076D');
            console.log('sample adress:', sampleAdress);
            var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
            console.log('hashed adress', buffer);
            stateDB.find(root, buffer, 0, function (err, val) {
                console.log('find:', val);
            })
        });
    });

});
