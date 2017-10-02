const winston = require('winston');

const _LOGGERS = {};

function getLogger(name) {
    if (!_LOGGERS[name]) {
        _LOGGERS[name] = new winston.Logger({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    label: name,
                    handleException: true,
                    json: false,
                    colorize: true
                })
            ],
            exitOnError: false
        });
    }

    return _LOGGERS[name];
}

module.exports = getLogger;
