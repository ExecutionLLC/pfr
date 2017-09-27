const ethers = require('ethers');
const Web3 = require('web3');

const CONTRACT = require('./contract');
const config = require('../utils/config');
const logger = require('../utils/log')('blockchain api');
const validator = require('../utils/validator');

// function _newWeb3Instance() {
//     const provider = new Web3.providers.HttpProvider(config.get('ethNodeUrl'));
//     return new Web3(provider);
// }
//
// function _getContractInstance(web3Instance) {
//     return new web3Instance.eth.Contract(CONTRACT.ABI, CONTRACT.ID);
// }
//
// function _getEthWallet(privateKey) {
//     if (!validator.isValidPrivateKey(privateKey)) {
//         throw Error('user private key is not valid');
//     }
//     const chainId = config.get('ethNodeChainId') || 1;
//     const provider = new ethers.providers.JsonRpcProvider(config.get('ethNodeUrl'), false, chainId);
//     return new ethers.Wallet(privateKey, provider);
// }
//
// function _getSignedContract(privateKey) {
//     const wallet = _getEthWallet(privateKey);
//     return ethers.Contract(CONTRACT.ABI, CONTRACT.ID, wallet);
// }
//
// const Api = {
//     getNpfList() {
//         const web3 = _newWeb3Instance();
//         const contractInstance = _getContractInstance(web3);
//
//         const options = {
//             fromBlock: 0,
//             toBlock: 'latest'
//         };
//
//         return contractInstance.getPastEvents('EventNewNpf', options).then((logs) => {
//             return logs.map(log => {
//                 const {_name: name, _owner: owner} = log.returnValues;
//                 return {
//                     name,
//                     owner,
//                     transactionHash: log.transactionHash
//                 }
//             });
//         });
//     },
//     getPersonInfoBySnils(snils) {
//         const web3 = _newWeb3Instance();
//         const contractInstance = _getContractInstance(web3);
//         return contractInstance.methods.personInfo(snils).call().then((result) => {
//             return {
//                 npf: result.npf,
//                 tariff: result.tariff
//             };
//         });
//     },
//     getPersonInfoByAddress(address) {
//         if (!validator.isValidWalletId(address)) {
//             throw Error('user address is not valid');
//         }
//         const web3 = _newWeb3Instance();
//         const contractInstance = _getContractInstance(web3);
//         return contractInstance.methods.personInfoByAddress(address).call().then((result) => {
//             return {
//                 npf: result.npf,
//                 tariff: result.tariff
//             };
//         });
//     },
//     changeTariff(privateKey, tariff) {
//         const contract = _getSignedContract(privateKey);
//         return contract.changeTariff(tariff).then((transaction) => {
//             return {
//                 transactionHash: transaction.hash
//             };
//         });
//     },
//     getOperationsList(address) {
//         if (!validator.isValidWalletId(address)) {
//             throw Error('user address is not valid');
//         }
//
//         const web3 = _newWeb3Instance();
//         const contractInstance = _getContractInstance(web3);
//
//         const options = {
//             filter: { _owner: address },
//             fromBlock: 0,
//             toBlock: 'latest'
//         };
//
//         return contractInstance.getPastEvents('EventOperation', options).then((logs) => {
//             return logs.map(log => {
//                 const {
//                     _npf: npf,
//                     _timestamp: timestamp,
//                     _amount: amount,
//                     _comment: comment
//                 } = log.returnValues;
//
//                 return {
//                     npf,
//                     timestamp,
//                     amount,
//                     comment,
//                     transactionHash: log.transactionHash
//                 }
//             });
//         });
//     }
// };

class BlockchainApi {
    constructor() {
        const provider = new Web3.providers.HttpProvider(config.get('ethNodeUrl'));
        this._web3 =  new Web3(provider);
        this._contract = new this._web3.eth.Contract(CONTRACT.ABI, CONTRACT.ID);

        this._npfCache = [];
        this._operationsCache = [];
    }

    _initNpfCache() {
        const logObjToNpfObj = (logObj) => {
            logObj = logObj.returnValues;
            return {
                name: logObj._name,
                owner: logObj._owner,
                transactionHash: logObj.transactionHash
            };
        };

        this._contract.events.EventNewNpf({
            fromBlock: 0
        }).on('data', (event) => {
            const npfObject = logObjToNpfObj(event);
            this._npfCache.push(npfObject);
            logger.info('got new npf object: ' + JSON.stringify(npfObject));
        }).on('change', (event) => {
            const removedTransactionHash = event.transactionHash;
            this._npfCache = this._npfCache.filter(
                value => value.transactionHash !== removedTransactionHash
            );
            logger.warn('removed npf object (transaction hash = ' + removedTransactionHash + ')');
        }).on('error', logger.error);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        return this._contract.getPastEvents('EventNewNpf', options).then((logs) => {
            const npfs = logs.map(logObj => logObjToNpfObj(logObj));
            this._npfCache = npfs.concat(this._npfCache);
            logger.info('npf cache filled (length = ' + this._npfCache.length + ')');
        });
    }

    _initOperationsCache() {
        const logObjToOperationObj = (logObj) => {
            logObj = logObj.returnValues;
            return {
                owner: logObj._owner,
                npf: logObj._npf,
                timestamp: logObj._timestamp,
                amount: logObj._amount,
                comment: logObj._comment,
                transactionHash: logObj.transactionHash
            };
        };

        this._contract.events.EventOperation({
            fromBlock: 0
        }).on('data', (event) => {
            const operationObject = logObjToOperationObj(event);
            this._operationsCache.push();
            logger.info('got new operation object: ' + JSON.stringify(operationObject));
        }).on('change', (event) => {
            const removedTransactionHash = event.transactionHash;
            this._operationsCache = this._operationsCache.filter(
                value => value.transactionHash !== removedTransactionHash
            );
            logger.warn('removed operation object (transaction hash = ' + removedTransactionHash + ')');
        }).on('error', logger.error);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        return this._contract.getPastEvents('EventOperation', options).then((logs) => {
            const operations = logs.map(logObj => logObjToOperationObj(logObj));
            this._operationsCache = operations.concat(this._operationsCache);
            logger.info('operations cache filled (length = ' + this._operationsCache.length + ')');
        });
    }

    init() {
        return Promise.all([this._initNpfCache(), this._initOperationsCache()]);
    }

    _getEthWallet(privateKey) {
        if (!validator.isValidPrivateKey(privateKey)) {
            throw Error('private key is not valid');
        }
        const chainId = config.get('ethNodeChainId') || 1;
        const provider = new ethers.providers.JsonRpcProvider(config.get('ethNodeUrl'), false, chainId);
        return new ethers.Wallet(privateKey, provider);
    }

    _getSignedContract(privateKey) {
        const wallet = this._getEthWallet(privateKey);
        return new ethers.Contract(CONTRACT.ABI, CONTRACT.ID, wallet);
    }

    getNpfList() {
        return this._npfCache;
    }

    getOperationsList(address) {
        if (!validator.isValidWalletId(address)) {
            throw Error('address is not valid');
        }

        const addressInUpperCase = address.toUpperCase();
        return this._operationsCache.filter(value => value.owner.toUpperCase() === addressInUpperCase);
    }

    getPersonInfoBySnils(snils) {
        return this._contract.methods.personInfo(snils).call().then((result) => {
            return {
                npf: result.npf,
                tariff: result.tariff
            };
        });
    }

    getPersonInfoByAddress(address) {
        if (!validator.isValidWalletId(address)) {
            throw Error('address is not valid');
        }

        return this._contract.methods.personInfoByAddress(address).call().then((result) => {
            return {
                npf: result.npf,
                tariff: result.tariff
            };
        });
    }

    changeTariff(privateKey, tariff) {
        const contract = this._getSignedContract(privateKey);
        return contract.changeTariff(tariff).then((transaction) => {
            return {
                transactionHash: transaction.hash
            };
        });
    }
}

module.exports = BlockchainApi;