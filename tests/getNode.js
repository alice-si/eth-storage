var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockStateRoot( 1117760, function (err,stateRoot) {
    stateDB.getNode(stateRoot, function (err,val) {
        console.log('stateRootNode:\n', val);
    });
});
