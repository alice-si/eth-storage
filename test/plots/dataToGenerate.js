var getRangeTests = [

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

module.exports.cases = getRangeTests;
