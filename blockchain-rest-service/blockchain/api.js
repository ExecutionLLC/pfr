const ethers = require('ethers');
const Web3 = require('web3');

const CONTRACT = require('./contract');
const config = require('../utils/config');
const logger = require('../utils/log')('blockchain api');
const validator = require('../utils/validator');

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
                tariff: logObj._tariff,
                timestamp: logObj._timestamp,
                amount: logObj._amount,
                contractor: logObj._contractor,
                comment: logObj._comment,
                transactionHash: logObj.transactionHash
            };
        };

        this._contract.events.EventOperation({
            fromBlock: 0
        }).on('data', (event) => {
            const operationObject = logObjToOperationObj(event);
            this._operationsCache.push(operationObject);
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

    static _getEthWallet(privateKey) {
        if (!validator.isValidPrivateKey(privateKey)) {
            throw Error('private key is not valid');
        }
        const chainId = config.get('ethNodeChainId') || 1;
        const provider = new ethers.providers.JsonRpcProvider(config.get('ethNodeUrl'), false, chainId);
        return new ethers.Wallet(privateKey, provider);
    }

    _getSignedContract(privateKey) {
        const wallet = _getEthWallet(privateKey);
        return new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, wallet);
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
        return this._contract.methods.personInfoBySnils(snils).call().then((result) => {
            return {
                npf: result.npf,
                tariff: result.tariff,
                balance: result.balance
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
                tariff: result.tariff,
                balance: result.balance
            };
        });
    }

    changeTariff(privateKey, tariff, timestamp) {
        if (!timestamp) {
            timestamp = Date.now();
        }

        const contract = this._getSignedContract(privateKey);
        return contract.changeTariff(tariff, timestamp).then((transaction) => {
            return {
                transactionHash: transaction.hash
            };
        });
    }

    changeNpf(privateKey, npfAddress, timestamp) {
        if (!timestamp) {
            timestamp = Date.now();
        }

        const contract = this._getSignedContract(privateKey);
        return contract.changeNpf(npfAddress, timestamp).then((transaction) => {
            return {
                transactionHash: transaction.hash
            };
        });
    }

    getTransaction(transactionHash) {
        return this._web3.eth.getTransaction(transactionHash);
    }
}

module.exports = BlockchainApi;