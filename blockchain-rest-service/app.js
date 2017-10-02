const bodyParser = require('body-parser')
const express = require('express');
const morgan = require('morgan');

const BlockchainApi = require('./blockchain/api');
const blockchainApiInstance = new BlockchainApi();

const config = require('./utils/config');
const logger = require('./utils/log')('app');

const app = express();

app.use(morgan('dev'));

function _normalizeHexString(hexString) {
    if (hexString && hexString.substring(0, 2) !== '0x') {
        return '0x' + hexString;
    }

    return hexString;
}

const _normalizeAddress = _normalizeHexString;
const _normalizePrivateKey = _normalizeHexString;
const _normalizeTransactionHash = _normalizeHexString;

// parse application/json
app.use(bodyParser.json());

app.get('/person/:address', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        result.operationsHistory = blockchainApiInstance.getOperationsHistory(address);
        result.tariffHistory = blockchainApiInstance.getTariffHistory(address);
        result.npfHistory = blockchainApiInstance.getNpfHistory(address);
        res.json(result);
    }).catch(next);
});

app.get('/person/:address/operationsHistory', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    const history = blockchainApiInstance.getOperationsHistory(address);
    res.json(history);
});

app.get('/person/:address/tariffHistory', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    const history = blockchainApiInstance.getTariffHistory(address);
    res.json(history);
});

app.get('/person/:address/npfHistory', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    const history = blockchainApiInstance.getNpfHistory(address);
    res.json(history);
});

app.get('/person/:address/npf', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        res.json({ npf: result.npf });
    }).catch(next);
});

app.put('/person/:address/npf', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    const privateKey = _normalizePrivateKey(req.body.privateKey);
    const npf = req.body.npf;
    const timestamp = req.body.timestamp;

    blockchainApiInstance.changeNpf(address, privateKey, npf, timestamp).then((result) => {
        res.json(result);
        res.status(202);
    }).catch(next);
});

app.get('/person/:address/tariff', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        res.json({ tariff: result.tariff });
    }).catch(next);
});

app.put('/person/:address/tariff', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    const privateKey = _normalizePrivateKey(req.body.privateKey);
    const tariff = req.body.tariff;
    const timestamp = req.body.timestamp;

    blockchainApiInstance.changeTariff(address, privateKey, tariff, timestamp).then((result) => {
        res.json(result);
        res.status(202);
    }).catch(next);
});

app.get('/person/:address/balance', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        res.json({ balance: result.balance });
    }).catch(next);
});

app.get('/transaction/:transactionhash', function (req, res, next) {
    const transactionHash = _normalizeTransactionHash(req.params.transactionhash);
    blockchainApiInstance.getTransaction(transactionHash).then((result) => {
        res.json(result);
    }).catch(next);
});

// catch 404 and forward to error handler
app.use(function(req, res, next){
    res.status(404);
    logger.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    logger.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
});

blockchainApiInstance.init().then(() => {
    const appPort = config.get('webServerPort') || 3000;
    app.listen(appPort, function () {
        logger.info('Server listening on port ' + appPort);
    });
}).catch(logger.error);