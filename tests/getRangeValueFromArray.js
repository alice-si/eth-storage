var StateDB = require('./../state.js');
var Settings = require('./settings.js');

/*
!!! rinkeby network adress, contract code head:

contract Escrow {

    struct transaction {
        uint amount;
        uint collateral;
        address sender;
        address receiver;
        uint id;
        uint deadline;
        bool accepted;
        bool senderCanWithdraw;
        bool receiverCanWithdraw;
        bool complete;
    }

    transaction[] public transactions;
    uint numTransactions = 0;
    mapping (address => uint[]) sentTransactions;
    mapping (address => uint[]) recTransactions;

    address owner;
    ...
*/

/*
expected output:

missing key in tree
storage at owner:
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>, val: <Buffer 02> },
  { block: <Buffer 00 00 00 00 00 11 0e 69>, val: <Buffer 03> } ]
storage at tranasactions[1]:
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>,
    val: <Buffer 01 63 45 78 5d 8a 00 00> } ]
storage at tranasactions[0]:
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>,
    val: <Buffer 02 c6 8a f0 bb 14 00 00> } ]
storage at 1:
 [ { block: <Buffer 00 00 00 00 00 11 0e 40>, val: <Buffer 02> },
  { block: <Buffer 00 00 00 00 00 11 0e 69>, val: <Buffer 03> } ]
    */

var stateDB = new StateDB(Settings.dbPath);

stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", stateDB.atStruct(0, 1), 1117760, 1117810, function (err, storage) {
    console.log('storage at tranasactions[1]:\n', storage);
});

stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", stateDB.atStruct(0, 0), 1117760, 1117810, function (err, storage) {
    console.log('storage at tranasactions[0]:\n', storage);
});

// 1117805
stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 1, 1117760, 1117810, function (err, storage) {
    console.log('storage at owner:\n', storage);
});

stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 1, 1117760, 1117810, function (err, storage) {
    console.log('storage at 1:\n', storage);
});

stateDB.getRange("6badc9463c5cc91cbfb5176ef99a454c3c77b00e", 2, 1117760, 1117810, function (err, storage) {
    console.log('storage at undefined:\n', storage);
});
