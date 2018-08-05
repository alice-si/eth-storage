var StateDB = require('../../ethStorage.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockHeader(1117760, function (err, storage) {
    stateDB.getNode(storage.stateRoot,function (err, node) {
        console.log('state root node in block 1117760:\n', node, '\nerr:', err);
    });
});
