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

app.get('/history/:address', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getOperationsList(address).then((result) => {
        res.json(result);
    }).catch(next);
});

app.get('/person/info/:address', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        res.json(result);
    }).catch(next);
});

app.get('/person/tariff/:address', function (req, res, next) {
    const address = _normalizeAddress(req.params.address);
    blockchainApiInstance.getPersonInfoByAddress(address).then((result) => {
        res.json({ tariff: result.tariff});
    }).catch(next);
});

app.get('/person/tariff/:privatekey/:tariff', function (req, res, next) {
    const privateKey = _normalizePrivateKey(req.params.privatekey);
    const tariff = parseInt(req.params.tariff, 10);

    if(isNaN(tariff)) {
        throw Error('tariff is not integer');
    }

    blockchainApiInstance.changeTariff(privateKey, tariff).then((result) => {
        res.json({ tariff: result.tariff});
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