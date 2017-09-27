const Validator = {
    isValidWalletId(address) {
        if (address.substring(0, 2) !== '0x') {
            return false;
        } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        } else {
            return true;
        }
    },
    isValidPrivateKey(key) {
        const prefixLength = key.substring(0, 2) === '0x' ? 2 : 0;
        const keyDigits = key.length - prefixLength;
        return keyDigits === 64 || keyDigits === 128 || keyDigits === 132;
    }
};

module.exports = Validator;