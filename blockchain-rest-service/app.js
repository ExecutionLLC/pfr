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

app.put('/person/:address/npf', function (req, res, next) {
    const privateKey = _normalizePrivateKey(req.body.privateKey);
    const npf = req.body.npf;
    const timestamp = req.body.timestamp;

    blockchainApiInstance.changeNpf(privateKey, npf, timestamp).then((transactionHash) => {
        res.json({ transactionHash });
    }).catch(next);
});

app.put('/person/:address/tariff', function (req, res, next) {
    const privateKey = _normalizePrivateKey(req.body.privateKey);
    const tariff = req.body.tariff;
    const timestamp = req.body.timestamp;
    
    blockchainApiInstance.changeTariff(privateKey, tariff, timestamp).then((transactionHash) => {
        res.json({ transactionHash });
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