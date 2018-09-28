var rlp = require('rlp');
const ethUtil = require('ethereumjs-util');

var Formatter = {};

/**
 * converts string in hex format or buffer to hex buffer
 * @method bufferHex
 * @param {string|Buffer} val
 * @returns {Buffer}
 */
Formatter.bufferHex = function (val) {
    if (val instanceof Buffer) {
        return val
    }
    else if (typeof val === 'string' && val.length > 2 && val.slice(0, 2) === '0x') {
        val = val.slice(2, val.length);
    }
    return new Buffer(val, 'hex');
};

/**
 * converts buffer to int
 * @method bufferToInt
 * @param {Buffer|all} val
 * @returns {int}
 */
Formatter.bufferToInt = function (val) {
    if (val instanceof Buffer) {
        return parseInt('0x' + val.toString('hex'));
    }
    return parseInt(val);
};

/**
 * converts buffer to string in hex format
 * @method bufferToString
 * @param {Buffer|all} val
 * @returns {string}
 */
Formatter.bufferToString = function (val) {
    if (val instanceof Buffer) {
        return val.toString('hex');
    }
    return val
};

/**
 * converts number in dec or buffer to 64 bits buffer
 * @method buffer64
 * @param {number} val
 * @returns {Buffer}
 */
Formatter.buffer64 = function (val) {
    if (val instanceof Buffer) {
        return val
    }
    var buf = new Buffer(8);
    buf.writeUInt32BE(parseInt(val), 4);
    return buf;
};

/**
 * converts number in dec or buffer to 256 bits buffer
 * @method buffer256
 * @param {number} val
 * @returns {Buffer}
 */
Formatter.buffer256 = function (val) {
    var self = this;
    if (val instanceof Buffer) {
        if (val.length <= 32) {
            var str = val.toString('hex');
            while (str.length < 64) {
                str = '0' + str;
            }
            return self.bufferHex(str)
        }
        return val
    }
    var buf = new Buffer(32);
    buf.writeUInt32BE(parseInt(val), 28);
    return buf;
};

/**
 * From ethUtil documentation:
 * Creates SHA-3 (Keccak) hash of the input [OBSOLETE]
 * @param {Buffer|Array|String|Number} a the input data
 * @param {Number} [bits=256] the SHA-3 width
 * @return {Buffer}
 */
Formatter.sha3 = ethUtil.sha3;

/**
 * returns hash for value at index at structure
 * @method atStruct
 * @param {number|Buffer} struct
 * @param {number|Buffer} index
 * @returns {Buffer}
 */
Formatter.atStruct = function (struct, index) {
    var self = this;
    struct = self.buffer256(struct);
    index = parseInt(index);
    var structKey = self.sha3(struct);
    var end = structKey.readInt32BE(28);
    end += index;
    structKey.writeInt32BE(end, 28);
    return structKey;
};

/**
 * returns hash for value at index at structure
 * @method atMap
 * @param {number|Buffer} map
 * @param {number|Buffer} key
 * @returns {Buffer}
 */
Formatter.atMap = function (map, key) {
    var self = this;
    map = self.buffer256(map);
    key = self.buffer256(key);
    return self.sha3(self.bufferHex(key.toString('hex') + map.toString('hex')));
};

/**
 * From rlp documentation:
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This function takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param {Buffer,String,int,Array,Uint8Array} data - will be converted to buffer
 * @returns {Buffer} - returns buffer of encoded data
 **/
Formatter.rlpDecode = rlp.decode;

module.exports = Formatter;
