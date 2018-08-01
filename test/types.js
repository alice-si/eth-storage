var assert = require('assert');
var Settings = require('./settings.js');
var StateDB = require('./../state.js');

var stateDB = new StateDB(Settings.dbPath);

console.log('34 in 64bits: ',stateDB.buffer64(34));
console.log('0x34 in 64bits: ',stateDB.buffer64(0x34));

// describe('Types conversions testing:',function () {
//     it('both should convert to 256 bit buffer',function () {
//         var index = stateDB.bufferHex(
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000001');
//         var index2 = stateDB.buffer256(1);
//         assert.equal(index.toString('hex'),index2.toString('hex'))
//     })
//     it('256 bit buffer from 256 bit buffer',function () {
//         var index = stateDB.bufferHex(
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000000' +
//             '00000001');
//         var index2 = stateDB.buffer256(1);
//         var index2 = stateDB.buffer256(index2);
//         assert.equal(index.toString('hex'),index2.toString('hex'))
//     });
//     it('both should convert to 64 bit buffer',function () {
//         var index = stateDB.bufferHex(
//             '00000000' +
//             '00000001');
//         var index2 = stateDB.buffer64(1);
//         assert.equal(index.toString('hex'),index2.toString('hex'))
//     });
//     it('64 bit buffer from 64 bit buffer',function () {
//         var index = stateDB.bufferHex(
//             '00000000' +
//             '00000001');
//         var index2 = stateDB.buffer64(1);
//         var index2 = stateDB.buffer64(index2);
//         assert.equal(index.toString('hex'),index2.toString('hex'));
//     });
//     it('buffer hex',function () {
//         var rawAdress = '6badc9463c5cc91cbfb5176ef99a454c3c77b00e'
//         var bufAdress = stateDB.bufferHex(rawAdress);
//         assert.equal(rawAdress,bufAdress.toString('hex'));
//     })
// });

