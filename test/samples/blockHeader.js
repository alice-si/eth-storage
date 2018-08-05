var StateDB = require('../../ethStorage.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockHeader(1117760, function (err, storage) {
    console.log('block 1117760 header:\n', storage);
});
