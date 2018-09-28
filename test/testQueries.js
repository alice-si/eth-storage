/**
 * @module testQueries
 * Exports arrays with queries for getRange function
 */

var getRangeTests = [

    // {
    //     adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
    //     idx: 0,
    //     startBlock: 2700000,
    //     endBlock: 2700500,
    //     msg: 'this is sample 500 blocks query, should run fas'
    // },
    // {
    //     adr: "0xcd56b102622125B62E7acEEdA08D393cA0cc28Fc",
    //     idx: 0,
    //     startBlock: 2700000,
    //     endBlock: 2700500,
    //     msg: 'this is sample 500 blocks query, should run fast'
    // },

    {
        adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
        idx: 0,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageInt, variable sStorageInt, sStorageByte and sStorageString where changed each 8 blocks'
    },
    {
        adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
        idx: 0,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageInt, sStorageByte and sStorageString where changed each 80 blocks'
    },
    {
        adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
        idx: 0,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageInt, sStorageByte where changed each 800 blocks, sStorageString where changed each 8 blocks'
    },
    {
        adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
        idx: 1,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageByte, variable sStorageInt, sStorageByte and sStorageString where changed each 8 blocks'
    },
    {
        adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
        idx: 1,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageByte, sStorageByte and sStorageString where changed each 80 blocks'
    },
    {
        adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
        idx: 1,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageByte, sStorageByte where changed each 800 blocks, sStorageString where changed each 8 blocks'
    },
    {
        adr: "0x16c8985321696c21d58f3194eee166eedaf37356",
        idx: 2,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageString, variable sStorageInt, sStorageByte and sStorageString where changed each 8 blocks'
    },
    {
        adr: "0xf0764a85241e2ad94a3c75e0a9a17d3ede3865ad",
        idx: 2,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageString, sStorageByte and sStorageString where changed each 80 blocks'
    },
    {
        adr: "0x68abe76de1aaaace161bae789a71e54183e1df8b",
        idx: 2,
        startBlock: 2785000,
        endBlock: 2795000,
        msg: 'get sStorageString, sStorageByte where changed each 800 blocks, sStorageString where changed each 8 blocks'
    },

];


var test6vars = [

    // {
    //     adr: "0x5bc5c31531e1e7a84df5a8e83da1c75bdb16a256",
    //     idx: 0,
    //     startBlock: 2901333,
    //     endBlock: 2901334,
    //     msg: 'one block'
    // },

    {
        adr: "0x5bc5c31531e1e7a84df5a8e83da1c75bdb16a256",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 5 block, cycle 50'
    },
    {
        adr: "0x21983b88993b18b1c040c3b8225b6037dd0f0400",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 5 block, cycle 500'
    },
    {
        adr: "0xbf9cecaa014ea8e569782833f266fdc7966ef4b9",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 100'
    },
    {
        adr: "0x5bc5c31531e1e7a84df5a8e83da1c75bdb16a256",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 5 block, cycle 50'
    },
    {
        adr: "0x21983b88993b18b1c040c3b8225b6037dd0f0400",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
    },
    {
        adr: "0xbf9cecaa014ea8e569782833f266fdc7966ef4b9",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 100'
    },
    {
        adr: "0x5bc5c31531e1e7a84df5a8e83da1c75bdb16a256",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 5 block, cycle 50'
    },
    {
        adr: "0x21983b88993b18b1c040c3b8225b6037dd0f0400",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 5 block, cycle 500'
    },
    {
        adr: "0xbf9cecaa014ea8e569782833f266fdc7966ef4b9",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 100'
    },

    {
        adr: "0x21ef697043810309630cf78ea95f7e334a16813e",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 1000'
    },
    {
        adr: "0x686bb1f3714b953661397956a2f37c8676b00e7e",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 20 block, cycle 200'
    },
    {
        adr: "0xbec575ac6fe2ad44bf689a3eaca5dea3f1330c61",
        idx: 0,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 20 block, cycle 2000'
    },
    {
        adr: "0x21ef697043810309630cf78ea95f7e334a16813e",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 1000'
    },
    {
        adr: "0x686bb1f3714b953661397956a2f37c8676b00e7e",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 20 block, cycle 2000'
    },
    {
        adr: "0xbec575ac6fe2ad44bf689a3eaca5dea3f1330c61",
        idx: 1,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 1000'
    },
    {
        adr: "0x21ef697043810309630cf78ea95f7e334a16813e",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 10 block, cycle 1000'
    },
    {
        adr: "0x686bb1f3714b953661397956a2f37c8676b00e7e",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 20 block, cycle 200'
    },
    {
        adr: "0xbec575ac6fe2ad44bf689a3eaca5dea3f1330c61",
        idx: 2,
        startBlock: 2901000,
        endBlock: 2911000,
        msg: 'change each 20 block, cycle 2000'
    },

];

var aliceQuery = [

    {
        adr: "0xBd897c8885b40d014Fb7941B3043B21adcC9ca1C",
        idx: 0,
        startBlock: 4724262,
        endBlock: 4725262,
        msg: 'Alice contract'
    },

];

module.exports.cases = getRangeTests;
module.exports.cases2 = test6vars;
module.exports.aliceContract = aliceQuery;
