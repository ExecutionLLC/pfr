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
        debugger;
        return {
            test:'test'
        }
        // const [goal, bought] = web3contract.progress();
        // return wallet.getBalance().then((balanceResult) => {
        //     const balance = new BigNumber(balanceResult);
        //     const tokenPrice = web3contract.tokenPrice();
        //     const canBeBought = balance.div(tokenPrice).floor();
        //     const tokensLeft = new BigNumber(goal).sub(bought);
        //     const walletTokens = web3contract.balanceOf(walletId);
        //     return {
        //         balance: web3.fromWei(balance, 'ether'),
        //         withdrawals: web3.fromWei(web3contract.pendingWithdrawals(walletId), 'ether'),
        //         price: web3.fromWei(tokenPrice, 'ether'),
        //         canBeBought: canBeBought,
        //         tokensLeft: tokensLeft,
        //         tokensAvailable: BigNumber.min(canBeBought, tokensLeft),
        //         walletTokens
        //     };
        // });
    }
};