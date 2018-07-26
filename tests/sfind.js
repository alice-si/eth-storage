var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockStateRoot(1117760, function (err,stateRoot) {
    var hashedAdress = stateDB.sha3(stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e'));
    stateDB.sfind(stateRoot, hashedAdress,function (err,val,stackPos,stack) {
        console.log('stateRootNode:\n','val',val,'stackPos',stackPos,'stack',stack);
    });
});
