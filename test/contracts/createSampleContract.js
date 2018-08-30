var Creator = require('./contractCreator.js');

var create = async function () {
    await Creator.setWeb3();
    await Creator.unlockAccount();
    Creator.deployContract(
        'sample contract',
        'this only for test purpose',
        'sampleContract_sol_SimpleStorage.abi',
        'sampleContract_sol_SimpleStorage.bin',
        function (err, contract) {
            console.log('już');
            Creator.endWeb3();
        })
};

create();