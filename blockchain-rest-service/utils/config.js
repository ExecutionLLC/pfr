const nconf = require('nconf');
const changeCase = require('change-case');

const ENV_VARIABLES_PREFIX = 'PFR_APP_';

function transformEnvVariable(keyValueObj) {
    const { key, value } = keyValueObj;
    const minKeyLength = ENV_VARIABLES_PREFIX.length + 1;
    if (!key || !key.startsWith(ENV_VARIABLES_PREFIX) || key.length < minKeyLength) {
        return false;
    }

    return {
        key: changeCase.camelCase(key.splice(8)),
        value
    };
}

nconf.file({
    file: 'default-config.json'
}).env({
    transform: transformEnvVariable,
    parseValues: true
}).argv();

module.exports = nconf;
