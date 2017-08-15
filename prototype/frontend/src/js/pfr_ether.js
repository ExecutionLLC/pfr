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
const BigNumber = Web3_require('bignumber.js');

const Ether = {
    getWalletInfoAsync(wallet) {
        const web3contract = web3.eth
            .contract(CONTRACT.ABI)
            .at(CONTRACT.ID);
        const walletId = wallet.address;
        return Ether.getNpfs()
            .then((logs) => {
                return new Promise(resolve => {
                    const accountType = web3contract.accountType(walletId);
                    resolve({
                        npfs:logs,
                        accountType
                    });
                });
            });

    },
    getNpfs() {
        return new Promise((resolve, reject )=> {
            const web3contract = web3.eth
                .contract(CONTRACT.ABI)
                .at(CONTRACT.ID);
            const npfEvent = web3contract.EventNewNpf({}, {
                fromBlock: 0,
                toBlock: 'latest'
            });
            npfEvent.get((error, logs) => {
                if (error) {
                    reject(error);
                } else {
                    const npfArray = logs.map(log => {
                        const {_name:name, _owner:owner} = log.args;
                       return {
                           name,
                           owner
                       }
                    });
                    resolve(npfArray)
                }
            });
        });
    },
    getBanks() {
        return new Promise((resolve, reject )=> {
            const web3contract = web3.eth
                .contract(CONTRACT.ABI)
                .at(CONTRACT.ID);
            const npfEvent = web3contract.EventNewBank({}, {
                fromBlock: 0,
                toBlock: 'latest'
            });
            npfEvent.get((error, logs) => {
                if (error) {
                    reject(error);
                } else {
                    const npfArray = logs.map(log => {
                        const {_name:name, _owner:owner} = log.args;
                        return {
                            name,
                            owner
                        }
                    });
                    resolve(npfArray)
                }
            });
        });
    },
    getWorkerHistory() {
        return new Promise((resolve, reject )=> {
            const web3contract = web3.eth
                .contract(CONTRACT.ABI)
                .at(CONTRACT.ID);
            const opHistoryEvent = web3contract.EventOperation({_owner:currentWallet.wallet.address}, {
                fromBlock: 0,
                toBlock: 'latest'
            });
            opHistoryEvent.get((error, logs) => {
                if (error) {
                    reject(error);
                } else {
                    const historyArray = logs.map(log => {
                        const {_owner: owner, _npf: npf, _timestamp: timestamp, _amount: amount, _comment: comment} = log.args;
                        return {
                            owner,
                            npf,
                            timestamp,
                            amount,
                            comment
                        }
                    });
                    resolve(historyArray)
                }
            });
        });
    }
};
