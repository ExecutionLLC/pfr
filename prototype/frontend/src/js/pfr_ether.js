const Web3_require = ((require) => {
    return (moduleName) => {
        const moduleKey = {
            'solidity': 7
        }[moduleName];
        return require(moduleKey == null ? moduleName : moduleKey);
    }
})(require);
// delete require;

const Web3 = Web3_require('web3');
const web3 = new Web3();