var StateDB = require('./../state.js');
var Settings = require('./settings.js');

var stateDB = new StateDB(Settings.dbPath);

stateDB.blockStateRoot( 1117760, function (err,stateRoot) {
    stateDB.getNode(stateRoot, function (err,val) {
        console.log('stateRootNode:\n', val);
    });
});

/*
stateRootNode:
 [ <Buffer 6c e1 28 b3 57 f2 9c 36 8d 7c 9b ec b8 58 cf 5f e2 61 cb e8 25 ff ec 7d 47 7a 83 2e f7 e3 ac 6a>,
  <Buffer 7f 25 d4 d2 a3 fe e9 6a 2e 11 12 36 8d b0 7c e3 cc bf a5 b5 c5 29 50 10 7c 3d 7e f5 e4 36 e3 d9>,
  <Buffer d0 61 ce 21 3d 3b 30 44 e6 e6 41 47 f6 d3 14 7e 32 db 8a 4a 05 87 bc 08 9a 89 e5 28 63 d1 2d 10>,
  <Buffer a6 b0 7b 9a 44 dc a0 d5 01 99 8b 4b c5 90 61 06 b9 a2 1f 30 1b 5a 9b ce 61 0d cc d6 f3 a0 20 35>,
  <Buffer 21 54 1e 63 03 d4 cc 81 98 55 32 64 ea 44 2a 4f 37 28 e2 28 f7 32 21 77 ae 48 ba 58 13 83 2c 9b>,
  <Buffer 1d 9a 6b 10 0c f8 0c da 33 de e4 50 93 4d a7 d2 69 08 e9 73 f6 2a 72 eb 83 cf 68 55 72 8a ba 16>,
  <Buffer c7 9b 43 72 b0 3c b8 2f ff 1a 54 cb aa a0 88 74 7f 92 3d 72 1d f0 eb 34 86 24 6b 1a fe 9f 43 25>,
  <Buffer da b7 34 a8 fe d4 da ac a1 2c d9 59 de 2f e3 3c 6e 1c 57 7b ac 20 8f 2f 8c 7e 25 4e 5e 6d c4 31>,
  <Buffer 45 8d 3c 53 e7 c1 cb e9 a8 19 55 b5 ab d9 9e d2 21 1f a2 9b 07 5e 04 6d 4d af 9d 19 a0 ba 25 ca>,
  <Buffer 20 cb 13 5e e4 a3 d4 3e 48 8a 09 52 8b b3 af 3e 4d ff 40 e9 d8 f8 4c fc 8c 53 06 5d dd a3 4b 5f>,
  <Buffer 2f ab 37 ca e0 e6 82 e7 5f 06 be 57 d0 d2 06 e9 8c 25 ea cb dc ed 8e 6a 0e 35 80 6a 85 42 b5 e5>,
  <Buffer 19 df 86 36 2b 5d fc c7 55 5d 9c 9d 18 af d6 cd 3e b5 f2 69 aa 07 1d d2 67 77 63 c7 21 dc 3b 3e>,
  <Buffer 20 30 2f b2 2c 1a fd f2 b2 7f 71 5a 09 dd 9e e0 bf 6a 1a cf 21 f4 50 1e 1f 55 7d e7 2b 99 3e 1c>,
  <Buffer 26 f9 70 27 3d b0 46 1f 76 41 78 0c 7a f4 c9 64 0c fb 28 54 d2 b8 79 ae f4 ad 78 c6 31 69 23 57>,
  <Buffer 69 56 e2 0b 0e 71 2e 99 a9 b9 a1 dc 75 b3 a8 db 3e 71 22 67 6e ab 0d e5 0f da 97 9d f2 77 11 c4>,
  <Buffer 3f 0a 5c 6e 7e a0 0b 06 95 e2 ff 59 b1 98 df 9f 10 77 9a 0f 84 7e 8e a8 c3 77 c4 95 bc 61 4a ff>,
  <Buffer > ]
 */