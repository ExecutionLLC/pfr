const web3 = require('web3');

const Validator = {
    isValidWalletId(address) {
        return web3.utils.isAddress(address);
    },
    isValidPrivateKey(key) {
        const prefixLength = key.substring(0, 2) === '0x' ? 2 : 0;
        const keyDigits = key.length - prefixLength;
        return keyDigits === 64 || keyDigits === 128 || keyDigits === 132;
    }
};

module.exports = Validator;
