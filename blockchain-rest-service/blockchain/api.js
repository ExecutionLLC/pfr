const ethers = require('ethers');
const Web3 = require('web3');

const CONTRACT = require('./contract');
const config = require('../utils/config');
const logger = require('../utils/log')('blockchain api');
const validator = require('../utils/validator');

function _newWeb3Instance() {
    const provider = new Web3.providers.HttpProvider(config.get('ethNodeUrl'));
    return new Web3(provider);
}

function _getContractInstance(web3Instance) {
    return new web3Instance.eth.Contract(CONTRACT.ABI, CONTRACT.ID);
}

function _getEthWallet(privateKey) {
    if (!validator.isValidPrivateKey(privateKey)) {
        throw Error('user private key is not valid');
    }
    const chainId = config.get('ethNodeChainId') || 1;
    const provider = new ethers.providers.JsonRpcProvider(config.get('ethNodeUrl'), false, chainId);
    return new ethers.Wallet(privateKey, provider);
}

function _getSignedContract(privateKey) {
    const wallet = _getEthWallet(privateKey);
    return ethers.Contract(CONTRACT.ABI, CONTRACT.ID, wallet);
}

const Api = {
    getNpfList() {
        const web3 = _newWeb3Instance();
        const contractInstance = _getContractInstance(web3);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };

        return contractInstance.getPastEvents('EventNewNpf', options).then((logs) => {
            const npfArray = logs.map(log => {
                const {_name: name, _owner: owner} = log.returnValues;
                return {
                    name,
                    owner,
                    transactionHash: log.transactionHash
                }
            });
            return npfArray;
        });
    },
    getPersonInfoBySnils(snils) {
        const web3 = _newWeb3Instance();
        const contractInstance = _getContractInstance(web3);
        return contractInstance.methods.personInfo(snils).call().then((result) => {
            return {
                npf: result.npf,
                tariff: result.tariff
            };
        });
    },
    getPersonInfoByAddress(address) {
        if (!validator.isValidWalletId(address)) {
            throw Error('user address is not valid');
        }
        const web3 = _newWeb3Instance();
        const contractInstance = _getContractInstance(web3);
        return contractInstance.methods.personInfoByAddress(address).call().then((result) => {
            return {
                npf: result.npf,
                tariff: result.tariff
            };
        });
    },
    changeTariff(privateKey, tariff) {
        const contract = _getSignedContract(privateKey);
        return contract.changeTariff(tariff).then((transaction) => {
            return {
                transactionHash: transaction.hash
            };
        });
    },
    getOperationsList(address) {
        if (!validator.isValidWalletId(address)) {
            throw Error('user address is not valid');
        }

        const web3 = _newWeb3Instance();
        const contractInstance = _getContractInstance(web3);

        const options = {
            filter: { _owner: address },
            fromBlock: 0,
            toBlock: 'latest'
        };

        return contractInstance.getPastEvents('EventOperation', options).then((logs) => {
            const historyArray = logs.map(log => {
                const {
                    _npf: npf,
                    _timestamp: timestamp,
                    _amount: amount,
                    _comment: comment
                } = log.returnValues;

                return {
                    npf,
                    timestamp,
                    amount,
                    comment,
                    transactionHash: log.transactionHash
                }
            });

            return historyArray;
        });
    }
};

module.exports = Api;