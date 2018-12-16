var StateDB = require('../../ethStorage/layers/highLevel.js');
var Settings = require('../settings.js');

console.log(Settings.dbPath,true);
var stateDB = new StateDB(Settings.dbPath,true);

stateDB.latestHeaderHash(console.log)
stateDB.latestHeaderNumber(console.log)

setTimeout(function (){
    stateDB.free();
},15*1000);



