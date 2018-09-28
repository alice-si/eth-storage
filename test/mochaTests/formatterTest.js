var FORMATTER = require('../../ethStorage/format/formatter.js');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
var assert = require('chai').assert;
var expect = require('chai').expect;

// var FORMATTER = new StateDB(Settings.dbPath);


describe('Types conversions testing:',function () {
    it('making buffer with address from \'0x\' prefix string, non prefix string and int',function () {
        var address = FORMATTER.bufferHex('0xD6aE8250b8348C94847280928c79fb3b63cA453e');
        var address2 = FORMATTER.bufferHex('D6aE8250b8348C94847280928c79fb3b63cA453e');
        assert.equal(address.toString('hex'),address2.toString('hex'))
    });
    it('buffer to string',function () {
        var address = FORMATTER.bufferHex('0xD6aE8250b8348C94847280928c79fb3b63cA453e');
        var address2 = FORMATTER.bufferHex('D6aE8250b8348C94847280928c79fb3b63cA453e');
        assert.equal(FORMATTER.bufferToString(address),'D6aE8250b8348C94847280928c79fb3b63cA453e'.toLocaleLowerCase())
        assert.equal(FORMATTER.bufferToString(address2),'D6aE8250b8348C94847280928c79fb3b63cA453e'.toLocaleLowerCase())
    });
    it('buffer to int',function () {
        var number = FORMATTER.buffer256(45);
        var number2 = FORMATTER.buffer256('45');
        var number3 = FORMATTER.buffer64(45);
        var number4 = FORMATTER.buffer64('45');
        assert.equal(FORMATTER.bufferToInt(number),45);
        assert.equal(FORMATTER.bufferToInt(number2),45);
        assert.equal(FORMATTER.bufferToInt(number3),45);
        assert.equal(FORMATTER.bufferToInt(number4),45);
    })
    it('both should convert to 256 bit buffer',function () {
        var index = FORMATTER.bufferHex(
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000001');
        var index2 = FORMATTER.buffer256(1);
        assert.equal(index.toString('hex'),index2.toString('hex'))
    })
    it('256 bit buffer from 256 bit buffer',function () {
        var index = FORMATTER.bufferHex(
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000000' +
            '00000001');
        var index2 = FORMATTER.buffer256(1);
        var index2 = FORMATTER.buffer256(index2);
        assert.equal(index.toString('hex'),index2.toString('hex'))
    });
    it('both should convert to 64 bit buffer',function () {
        var index = FORMATTER.bufferHex(
            '00000000' +
            '00000001');
        var index2 = FORMATTER.buffer64(1);
        assert.equal(index.toString('hex'),index2.toString('hex'))
    });
    it('64 bit buffer from 64 bit buffer',function () {
        var index = FORMATTER.bufferHex(
            '00000000' +
            '00000001');
        var index2 = FORMATTER.buffer64(1);
        var index2 = FORMATTER.buffer64(index2);
        assert.equal(index.toString('hex'),index2.toString('hex'));
    });
    it('buffer hex',function () {
        var rawAdress = '6badc9463c5cc91cbfb5176ef99a454c3c77b00e'
        var bufAdress = FORMATTER.bufferHex(rawAdress);
        assert.equal(rawAdress,bufAdress.toString('hex'));
    })

});

