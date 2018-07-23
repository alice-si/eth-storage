var StateDB = require('./state.js');
var Trie = require('../merkle-patricia-tree');

// var db = levelup(leveldown('./geth/chaindata'));
var rlp = require('rlp')

var stateDB = new StateDB('./geth/chaindata');
console.log('stateDB n ', stateDB.n)
// var block_hash = "e0d41a9cf2a6b717c702edebf107cf66a3e044d0fb61d5d78eef179d3754283c";
var block_hash = "fcf17eb9a74894f0e3fd09ca1e72e98d915644c6118ac4f4c3b385c56facbdee";

var hash_buf = stateDB.bufferHex(block_hash);

stateDB.blockNumberByHash(hash_buf, function (err, val) {

    var blockNumber = val;
    // console.log('blockNumber ', val);
    //
    //
    // stateDB.blockHeader(blockNumber, function (err, val) {
    //     console.log('blockHeader', val);
    // });
    // stateDB.blockBody(blockNumber, function (err, val) {
    //     console.log('blockBody', val);
    // });
    //
    // stateDB.blockHeaderByHash(hash_buf, function (err, val) {
    //     console.log('blocHeaderByHash ', val);
    //
    //
    // });
    // stateDB.blockStateRoot(blockNumber, function (err, root) {
    //     root = '0x' + root.toString('hex');
    //     console.log('blockStateRoot ', root);
    // var trie = new Trie(stateDB.db,root);
    // trie.createReadStream()
    //     .on('data',function (data) {
    //         console.log('data',data)
    //         })
    //         .on('end',()=>console.log('End'))
    // });
    // stateDB.storageIndex(stateDB.hashBuffer('458dFB3A8457451c7e40403e9C065f05F419f02c'),blockNumber,function (err, val) {
    //
    // });
    // console.log('hash buff ',stateDB.hashBuffer('458dFB3A8457451c7e40403e9C065f05F419f02c'))
    // var blockQuery = stateDB.blockQuery(blockNumber,stateDB.hashBuffer('458dFB3A8457451c7e40403e9C065f05F419f02c'))
    // console.log('block query ',blockQuery)
    //
    // stateDB.db.get(
    //     blockQuery
    //     stateDB.hashBuffer('458dFB3A8457451c7e40403e9C065f05F419f02c')
    // stateDB.blockQuery(blockNumber,stateDB.hashBuffer('0x458dFB3A8457451c7e40403e9C065f05F419f02c'))
    // ,{
    // keyEncoding: 'binary',
    // valueEncoding: 'binary'
    // },function (err, val) {
    //      console.log('lil dbquery ',val)
    // })
});

stateDB.db.get(new Buffer('LastBlock'), function (err, ltblhash) {
    console.log('last block is: ', ltblhash);
    stateDB.blockNumberByHash(ltblhash, function (err, number) {
        stateDB.blockStateRoot(number, function (err, root) {
            // console.log('rawBlockStateRoot', root.toString())
            // root = '0x' + root.toString('hex');
            console.log('blockStateRoot ', root);
            // var trie = new Trie(stateDB.db, root);
            // trie.createReadStream()
            //         .on('data', function (data) {
            //             console.log('data', data)
            //         })
            //         .on('end', () => console.log('End'))

            // stateDB.db.get(root,function (err, val) {
            //     console.log('looking state root in db: ',val)
            // });

            // });
            // var buffer = stateDB.hashBuffer('458dFB3A8457451c7e40403e9C065f05F419f02c');
            // var buffer = stateDB.hashBuffer('31DBfc0B2fA2f649c23D45f52408ce1189F52b35');
            // var buffer = stateDB.hashBuffer(stateDB.sha3('59B66c66b9159b62DaFCB5fEde243384DFca076D'));
            var buffer = stateDB.bufferHex(
                stateDB.sha3(
                    stateDB.bufferHex(
                        '59B66c66b9159b62DaFCB5fEde243384DFca076D')));
            console.log('buff (adress)',buffer);
            // console.log('buffer ',buffer);
            // stateDB.getStorage(buffer,number,function (err,val) {
            // });
            // var recWrite = function(parent){
            //     return function (err, val) {
            //         var self = this;
            //         console.log('getNode: ', val);
            //         stateDB.getNode(val[0],parent);
            //     }
            // };
            // stateDB.blockStateRoot(number, function (err, val) {
            //     stateDB.getNode(val, recWrite);
            // });
            // trie.findPath(buffer, function (err, node, remainder, stack) {
            //     console.log(node)
            //     var value = null;
            //     if (node && remainder.length === 0) {
            //         value = node.value
            //     }
            //
            //
            // });
            stateDB.find(root,buffer,0,function (err,val) {
                console.log('find:output:',val);
            })
        });
    });


})
;






