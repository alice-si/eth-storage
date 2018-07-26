var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockStateRoot(1117760, function (err,stateRoot) {
    var hashedAdress = stateDB.sha3(stateDB.bufferHex('6badc9463c5cc91cbfb5176ef99a454c3c77b00e'));
    stateDB.sfind(stateRoot, hashedAdress,function (err,val,stackPos,stack) {
        console.log('stateRootNode:\n','val\n',val,'stackPos\n',stackPos,'stack\n',stack);
    });
});

/*
stateRootNode:
 val
 [ <Buffer 01>,
  <Buffer >,
  <Buffer 36 fb c4 ce f8 04 d7 c6 c4 6d 14 29 00 c9 d5 e7 cf 21 42 f2 f3 aa 8b 8e 46 04 0c ac 3a d4 a4 b0>,
  <Buffer 41 71 6d 52 f4 df 87 52 f9 2d c6 67 87 17 85 ea 2e 08 6c 32 75 be 3d 05 fb ad cc 18 e6 96 d0 05> ] stackPos
 [ 0, 1, 2, 3, 4, 5, 6 ] stack
 [ <Buffer 26 37 4d 6d 19 28 3d 91 18 28 2a a1 b4 21 47 7e 8b c7 50 19 aa d1 2e 55 7b 35 b8 f2 b1 d7 ee 8d>,
  <Buffer 19 df 86 36 2b 5d fc c7 55 5d 9c 9d 18 af d6 cd 3e b5 f2 69 aa 07 1d d2 67 77 63 c7 21 dc 3b 3e>,
  <Buffer 62 0b 39 5d 85 98 f5 66 26 ef 6d 8c 7f 5c d6 c3 63 8f 98 66 58 15 06 08 bc d2 a6 d6 a6 a9 c2 9a>,
  <Buffer bb e9 84 f9 7a a4 ef c8 d7 ee cc 40 76 3c 1c 62 ce 53 95 ea f7 3a 07 c6 e4 e5 61 00 fa 27 20 c3>,
  <Buffer 26 03 ba 19 b5 fe 33 47 60 74 a4 df 1f 73 45 f1 18 6f dc 94 af 7e fc b9 b1 bf 7f 7a e0 04 b6 b0>,
  <Buffer 93 2d 2c 5a 85 05 38 a3 62 95 a1 11 dd 9c 1b b7 09 ae 2e af 8f dc 53 85 42 fa 12 01 64 59 e2 3f>,
  <Buffer c5 0c 11 28 f0 69 95 89 2c e6 0f fa 2e 26 1e 63 bc 98 dc 9c 0b ad d7 d5 10 d4 63 ca a1 23 a2 84> ]
 */