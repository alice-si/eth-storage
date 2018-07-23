var StateDB = require('./../state.js');

var stateDB = new StateDB('./../geth/chaindata');

console.log('34 in 64bits: ',stateDB.buffer64(34));
console.log('0x34 in 64bits: ',stateDB.buffer64(0x34));
