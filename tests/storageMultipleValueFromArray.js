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

var stateDB = new StateDB(Settings.dbPath);

stateDB.getMultiple("6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    1117760, // start block
    1117810, //end block
    stateDB.atStruct(0,1), // index
    5, // step
    function (err, storage) {
        console.log('storage at tranasactions[1]:\n', storage);
    });

stateDB.getMultiple("6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    1117760, // start block
    1117810, //end block
    stateDB.atStruct(0,0), // index
    5, // step
    function (err, storage) {
        console.log('storage at tranasactions[0]:\n', storage);
    });

stateDB.getMultiple("6badc9463c5cc91cbfb5176ef99a454c3c77b00e",
    1117760, // start block
    1117810, //end block
    1, // index
    5, // step
    function (err, storage) {
        console.log('numTransactions:\n', storage);
    });
