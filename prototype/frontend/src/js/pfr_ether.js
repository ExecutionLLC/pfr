const Web3_require = ((require) => {
    return (moduleName) => {
        const moduleKey = {
            'solidity': 7
        }[moduleName];
        return require(moduleKey == null ? moduleName : moduleKey);
    }
})(require);
// delete require;

const Web3 = Web3_require('web3');
const web3 = new Web3();

const Ether = {
    getWalletInfoAsync(wallet) {
        const web3contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const walletId = wallet.address;
        return new Promise(resolve => {
            resolve(web3contract.accountType(walletId));
        });
    }
};