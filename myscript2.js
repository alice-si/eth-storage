var Trie = require('../merkle-patricia-tree');
var rlp = require('rlp');
var levelup = require('levelup');
var leveldown = require('leveldown');

var db = levelup(leveldown('./geth/chaindata'));
// var level = require('level')
// var db = level('./geth')


//the genesis state root
var root = '0xe0d41a9cf2a6b717c702edebf107cf66a3e044d0fb61d5d78eef179d3754283c';
var trie = new Trie(db, root);

//gav's address
// var gav = new Buffer('8a40bfaa73256b60764c1bf40675a99083efb075', 'hex');
var gav = new Buffer('c4294E3691F0eFD0d737aE838d24BebBe636BDd4', 'hex');

trie.get(gav, function (err, val) {
    var decoded = rlp.decode(val);
    console.log('decoded ',decoded);
});

var n = 2;
var i = 0;

var stream = db.createReadStream()
    stream
    .on('data', function (data) {
        if (i < n) {
            i++;
            console.log('n is: ',i,' output is: ',data.key, '=', data.value)
        }
        else{
            stream.destroy();
        }
    })
    .on('end', function () {
        console.log('Stream ended')
    })

var blockhash = new Buffer('e0d41a9cf2a6b717c702edebf107cf66a3e044d0fb61d5d78eef179d3754283c', 'hex');
console.log(blockhash);
var prefix = new Buffer('H');
console.log(prefix)
var query = Buffer.concat([prefix,blockhash])
console.log(query)

var blocknumber;

db.get(query,function (err,val) {
    console.log('val is: ',val);
    // var decoded = rlp.decode(val);
    // console.log('decoded val is: ',decoded);
    blocknumber = new Buffer(val);

    console.log('val buffer is: ',blocknumber);

    var header_prefix = new Buffer('h');
    var header_prefix = new Buffer('h');
    var header_query = Buffer.concat([header_prefix,blocknumber,blockhash]);

    console.log('header query is: ',header_query);

    db.get(header_query,function (err,val) {
        console.log('val is: ',val)
        var decoded = rlp.decode(val);
        console.log('decoded val is: ',decoded);

        // blocknumber = new Buffer(val);
        console.log('decoded[3] ',decoded[3])
        trie.get(decoded[3], function (err, val) {
            var decoded2 = rlp.decode(val);
            console.log('val 2: ', val)
            console.log('decoded 2: ',decoded2);
        });
    })
    db.get(header_query,function (err,val) {
        console.log('val is: ',val)
        var decoded = rlp.decode(val);
        console.log('decoded val is: ',decoded);

        // blocknumber = new Buffer(val);
        console.log('decoded[3] ',decoded[3])
        trie.get(decoded[3], function (err, val) {
            var decoded2 = rlp.decode(val);
            console.log('val 2: ', val)
            console.log('decoded 2: ',decoded2);
        });
    })
});



