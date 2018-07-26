var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockStateRoot(1117760, function (err, stateRoot) {
    var hashedAdress = stateDB.sha3(stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e'));
    stateDB.sfind(stateRoot, hashedAdress, function (err, val, stackPos, stack) {
        console.log('1) storageRootNode:\n', 'val', val, 'stackPos', stackPos, 'stack', stack);
        console.log('--------------------------------------------------------')
        stateDB.sfindExpected(stateRoot, hashedAdress, stackPos, stack, function (err, val, stackPos, stack) {
            console.log('2) storageRootNode:\n', 'val', val, 'stackPos', stackPos, 'stack', stack);
            stateDB.blockStateRoot(1117000,function (err, stateRoot) {
                stateDB.sfindExpected(stateRoot, hashedAdress, stackPos, stack, function (err, val, stackPos, stack) {
                    console.log('3) storageRootNode:\n', 'val', val, 'stackPos', stackPos, 'stack', stack);
                })
            })
        })
    });
});
