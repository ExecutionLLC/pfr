const ethers = require('ethers');
const Web3 = require('web3');

const CONTRACT = require('./contract');
const config = require('../utils/config');
const logger = require('../utils/log')('blockchain api');
const validator = require('../utils/validator');

class BlockchainApi {
    constructor() {
        const provider = new Web3.providers.WebsocketProvider(config.get('ethNodeWsUrl'));
        this._web3 =  new Web3(provider);
        this._contract = new this._web3.eth.Contract(CONTRACT.ABI, CONTRACT.ID);

        this._npfCache = [];
        this._operationsHistoryCache = [];
        this._tariffHistoryCache = [];
        this._npfHistoryCache = [];
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

    _initOperationsHistoryCache() {
        const logObjToHistoryObj = (logObj) => {
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
            const historyObject = logObjToHistoryObj(event);
            this._operationsHistoryCache.push(historyObject);
            logger.info('got new operation history object: ' + JSON.stringify(historyObject));
        }).on('change', (event) => {
            const removedTransactionHash = event.transactionHash;
            this._operationsHistoryCache = this._operationsHistoryCache.filter(
                value => value.transactionHash !== removedTransactionHash
            );
            logger.warn('removed operation history object (transaction hash = ' + removedTransactionHash + ')');
        }).on('error', logger.error);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        return this._contract.getPastEvents('EventOperation', options).then((logs) => {
            const history = logs.map(logObj => logObjToHistoryObj(logObj));
            this._operationsHistoryCache = history.concat(this._operationsHistoryCache);
            logger.info('operations history cache filled (length = ' + this._operationsHistoryCache.length + ')');
        });
    }

    _initTariffHistoryCache() {
        const logObjToHistoryObj = (logObj) => {
            logObj = logObj.returnValues;
            return {
                owner: logObj._owner,
                oldTariff: logObj._oldTariff,
                newTariff: logObj._newTariff,
                timestamp: logObj._timestamp
            };
        };

        this._contract.events.EventTariffChanged({
            fromBlock: 0
        }).on('data', (event) => {
            const historyObject = logObjToHistoryObj(event);
            this._tariffHistoryCache.push(historyObject);
            logger.info('got new tariff history object: ' + JSON.stringify(historyObject));
        }).on('change', (event) => {
            const removedTransactionHash = event.transactionHash;
            this._tariffHistoryCache = this._tariffHistoryCache.filter(
                value => value.transactionHash !== removedTransactionHash
            );
            logger.warn('removed tariff history object (transaction hash = ' + removedTransactionHash + ')');
        }).on('error', logger.error);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        return this._contract.getPastEvents('EventTariffChanged', options).then((logs) => {
            const history = logs.map(logObj => logObjToHistoryObj(logObj));
            this._tariffHistoryCache = history.concat(this._tariffHistoryCache);
            logger.info('tariff history cache filled (length = ' + this._tariffHistoryCache.length + ')');
        });
    }

    _initNpfHistoryCache() {
        const logObjToHistoryObj = (logObj) => {
            logObj = logObj.returnValues;
            return {
                owner: logObj._owner,
                oldNpf: logObj._oldNpf,
                newNpf: logObj._newNpf,
                timestamp: logObj._timestamp
            };
        };

        this._contract.events.EventNpfChanged({
            fromBlock: 0
        }).on('data', (event) => {
            const historyObject = logObjToHistoryObj(event);
            this._npfHistoryCache.push(historyObject);
            logger.info('got new npf history object: ' + JSON.stringify(historyObject));
        }).on('change', (event) => {
            const removedTransactionHash = event.transactionHash;
            this._npfHistoryCache = this._npfHistoryCache.filter(
                value => value.transactionHash !== removedTransactionHash
            );
            logger.warn('removed npf history object (transaction hash = ' + removedTransactionHash + ')');
        }).on('error', logger.error);

        const options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        return this._contract.getPastEvents('EventNpfChanged', options).then((logs) => {
            const history = logs.map(logObj => logObjToHistoryObj(logObj));
            this._npfHistoryCache = history.concat(this._npfHistoryCache);
            logger.info('npf history cache filled (length = ' + this._npfHistoryCache.length + ')');
        });
    }

    init() {
        return Promise.all([
            this._initNpfCache(),
            this._initOperationsHistoryCache(),
            this._initTariffHistoryCache(),
            this._initNpfHistoryCache()
        ]);
    }

    static _getEthWallet(privateKey) {
        if (!validator.isValidPrivateKey(privateKey)) {
            throw Error('private key is not valid');
        }
        const chainId = config.get('ethNodeChainId') || 1;
        const provider = new ethers.providers.JsonRpcProvider(config.get('ethNodeHttpUrl'), false, chainId);
        return new ethers.Wallet(privateKey, provider);
    }

    _getSignedContract(privateKey) {
        const wallet = BlockchainApi._getEthWallet(privateKey);
        return new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, wallet);
    }

    getNpfList() {
        return this._npfCache;
    }

    static _getHistory(historyArray, address) {
        if (!validator.isValidWalletId(address)) {
            throw Error('address is not valid');
        }

        const addressInUpperCase = address.toUpperCase();
        return historyArray.filter(value => value.owner.toUpperCase() === addressInUpperCase);
    }

    getOperationsHistory(address) {
        return BlockchainApi._getHistory(this._operationsHistoryCache, address);
    }

    getTariffHistory(address) {
        return BlockchainApi._getHistory(this._tariffHistoryCache, address);
    }

    getNpfHistory(address) {
        return BlockchainApi._getHistory(this._npfHistoryCache, address);
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