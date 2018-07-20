var StateDB = require('./state.js');

// var db = levelup(leveldown('./geth/chaindata'));

var stateDB = new StateDB('./geth/chaindata');
console.log('stateDB n ',stateDB.n)
var block_hash = "e0d41a9cf2a6b717c702edebf107cf66a3e044d0fb61d5d78eef179d3754283c";

var hash_buf = stateDB.hashBuffer(block_hash);

stateDB.blockNumberByHash(hash_buf,function (err, val) {

    var blockNumber = val;
    console.log('blockNumber ',val);

    stateDB.blockHeader(blockNumber,function (err, val) {
        console.log('blockHeader',val);
    });
});

stateDB.blockHeaderByHash(hash_buf,function (err, val) {
    console.log('blocHeaderByHash ',val);
});

// console.log('header by number ',stateDB.blockHeader(blockNumber));
// console.log('header by hash: ',stateDB.blockHeaderByHash(hash_buf));



