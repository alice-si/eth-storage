var Trie = require('../../merkle-patricia-tree');
var StateDB = require('./../state.js');
var stateDB = new StateDB('./../geth/chaindata');
// var stateDB = new StateDB('C:/Users/ja1/Alice/dirforfullrinkeby/geth/chaindata');
var sampleAdress = stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e');
var number = stateDB.bufferHex('0000000000288a88');
console.log('sample adress:', sampleAdress);
// var buffer = stateDB.hashBuffer(stateDB.sha3(sampleAdress));
// console.log('hashed adress', buffer);
stateDB.getStorageTree(sampleAdress, number, function (err, storage) {
    console.log('storage:', storage);
    var hashedindex = stateDB.bufferHex(
        stateDB.sha3(
            stateDB.bufferHex(
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000000' +
                '00000001')));
    console.log('hashed 0: ',hashedindex)
    // stateDB.find(getStorage[2],hashedindex,0,function (err,val) {
    //     console.log('at index getStorage ',val);
    // });
    trie = new Trie(stateDB.db,storage[2]);
    trie.createReadStream()
            .on('data', function (data) {
                // console.log(data['value'].toString('hex'));
                // if(data['value'].toString('hex').slice(data['value'].toString('hex').length-4,data['value'].toString('hex').length) == '24c2')
                if(data['key'].toString('hex')==hashedindex.toString('hex'))
                    console.log('>>>>>>>>>>>>>>>>>>>data', data['key'])
                console.log('data', data['key'])
            })
            .on('end', () => console.log('End'))
});
