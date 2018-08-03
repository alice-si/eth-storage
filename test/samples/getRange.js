var StateDB = require('../../stateHashSet.js');
var Settings = require('../settings.js');

var stateDB = new StateDB(Settings.dbPath);

/*
expected output:

storage at index:
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>, val: <Buffer 02> },
  { block: <Buffer 00 00 00 00 00 11 0e 69>, val: <Buffer 03> } ]p
 */

stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 0, 1117760, 1117810, function (err, storage) {
    console.log('storage at index:\n', storage);
});