let currentWallet = null;

function readFileContentAsync(file) {
    if (file.size > 102400) { // 100K JSON wallet will be our limit
        return Promise.reject(`JSON file too big (${file.size} bytes)`);
    } else {
        return new Promise((resolve) => {
            const fr = new FileReader();
            fr.onload = function () {
                resolve(fr.result);
            };
            fr.readAsText(file);
        });
    }
}

const Page = {
    ELEMENT_ID: {
        NODES: {
            NODE: 'select-node',
            ADD_NODE_GROUP: 'add-node-group',
            ADD_NODE_SHOW_BUTTON: 'add-node-button',
            REMOVE_NODE_BUTTON: 'remove-node-button',
            NAME: 'select-node-name',
            URL: 'select-node-url',
            CHAIN_ID: 'select-node-chain-id',
            ADD: 'select-node-add',
            CANCEL: 'select-node-cancel',
            ADD_ERROR: 'add-node-error',
            NODE_ERROR: 'node-error'
        },
        ALTER_WALLET: {
            PRIVATE_KEY: {
                GROUP: 'add-wallet-private-key-group',
                KEY: 'add-wallet-private-key',
                BUTTON: 'add-wallet-private-key-button',
                WAIT: 'add-wallet-private-key-wait',
                ERROR: 'add-wallet-private-key-error'
            },
            FILE: {
                GROUP: 'add-wallet-file-group',
                FILE: 'add-wallet-file',
                PASSWORD: 'add-wallet-file-password',
                BUTTON: 'add-wallet-file-button',
                WAIT: 'add-wallet-file-wait',
                ERROR: 'add-wallet-file-error'
            }
        }
    },
    $id(id) {
        return $(`#${id}`);
    },
    setNodes(nodesNames, currentId, canRemove) {
        $.each(nodesNames, (i, {id, name}) => {
            Page.appendNode(id, name);
        });
        Page.selectNode(currentId);
        Page.nodesState.disableRemoveNode(!canRemove);
    },
    appendNode(value, name) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .append($('<option></option>')
                .attr("value", value)
                .text(name));
    },
    removeNode(value) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE)
            .find(`[value="${value}"]`)
            .remove();
    },
    showAddNodeValid(nameValid, urlValid, chainIdValid) {
        const allValid = nameValid && urlValid && chainIdValid;
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggleClass('has-error', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.ADD).prop('disabled', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.NAME).toggleClass('alert-danger', !nameValid);
        Page.$id(Page.ELEMENT_ID.NODES.URL).toggleClass('alert-danger', !urlValid);
        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).toggleClass('alert-danger', !chainIdValid);
    },
    showNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE_ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.ADD_ERROR)
            .text(error)
            .toggle(error != null);
    },
    selectNode(valueToSelect) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE).val(valueToSelect);
    },
    getSelectedNode() {
        return Page.$id(Page.ELEMENT_ID.NODES.NODE).val();
    },
    nodesState: {
        _disableRemove: false,
        _nodeAdding: false,
        _showCurrentState() {
            const disableRemove = Page.nodesState._disableRemove;
            const nodeAdding = Page.nodesState._nodeAdding;
            Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).prop('disabled', disableRemove || nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggle(nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).prop('disabled', nodeAdding);
            Page.$id(Page.ELEMENT_ID.NODES.NODE).prop('disabled', nodeAdding);
        },
        init() {
            Page.nodesState._showCurrentState();
        },
        disableRemoveNode(disable) {
            Page.nodesState._disableRemove = disable;
            Page.nodesState._showCurrentState();
        },
        toggleNodeAdding(adding) {
            Page.nodesState._nodeAdding = adding;
            Page.nodesState._showCurrentState();
        }
    },
    showAlterWalletPrivateKeyWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showAlterWalletFileWait(isWaiting) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
    },
    showAlterWalletPrivateKeyError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletFileError(error) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAlterWalletValid(keyValid, fileValid, filePasswordValid) {
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.GROUP).toggleClass('has-error', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).prop('disabled', !keyValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.GROUP).toggleClass('has-error', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).prop('disabled', !fileValid || !filePasswordValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE).toggleClass('alert-danger', !fileValid);
        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).toggleClass('alert-danger', !filePasswordValid);
    },
    showCurrentWallet(walletInfo) {
        console.log(walletInfo);
        // Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.CONTAINER).toggle(!!walletInfo);
        // if (!walletInfo) {
        //     return;
        // }
        // const {wallet, info, gasPrice} = walletInfo;
        // Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.WALLET_ADDRESS).text(wallet.address);
        // const INFO_IDS = Page.ELEMENT_ID.ALTER_WALLET.INFO;
        // Page.$id(INFO_IDS.BALANCE).text(info.balance);
        // Page.$id(INFO_IDS.WITHDRAWALS).text(info.withdrawals);
        // Page.$id(INFO_IDS.PRICE).text(info.price);
        // Page.$id(INFO_IDS.CAN_BE_BOUGHT).text(info.canBeBought);
        // Page.$id(INFO_IDS.TOKENS_LEFT).text(info.tokensLeft);
        // Page.$id(INFO_IDS.WALLET_TOKENS).text(info.walletTokens);
        //
        // Page.$id(Page.ELEMENT_ID.ALTER_WALLET.OPERATIONS.BUY.GAS_PRICE).val(gasPrice);
    },

    init() {
        Page.showNodeError();
        Page.showAddNodeError();
        Page.showAlterWalletPrivateKeyWait(false);
        Page.showAlterWalletFileWait(false);
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        Page.nodesState.init();

        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_SHOW_BUTTON).click(() => {
            Page.nodesState.toggleNodeAdding(true);
            Page.showNodeError();
            Page.showAddNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.CANCEL).click(() => {
            Page.nodesState.toggleNodeAdding(false);
            Page.showNodeError();
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.ADD).click(() => {
            Page.showAddNodeError();
            Page.showNodeError();
            try {
                const name = Page.$id(Page.ELEMENT_ID.NODES.NAME).val();
                const url = Page.$id(Page.ELEMENT_ID.NODES.URL).val();
                const chainId = Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val();
                const {id, node, canRemoveNode} = Page.onNodeAdd({name, url, chainId});
                Page.appendNode(id, node.name);
                Page.selectNode(id);
                Page.nodesState.toggleNodeAdding(false);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
            }
            catch (e) {
                Page.showAddNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.REMOVE_NODE_BUTTON).click(() => {
            Page.showNodeError();
            const curNodeId = Page.getSelectedNode();
            try {
                const {id, canRemoveNode} = Page.onNodeRemove(curNodeId);
                Page.removeNode(curNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
                Page.selectNode(id);
            } catch (e) {
                Page.showNodeError(e);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.NODES.NODE).change(() => {
            Page.showNodeError();
            const currentNodeId = Page.getSelectedNode();
            try {
                const canRemoveNode = Page.onNodeChange(currentNodeId);
                Page.nodesState.disableRemoveNode(!canRemoveNode);
            }
            catch (e) {
                Page.showNodeError(e);
            }
        });

        // Add node validation >>>

        Page.showAddNodeValid(false);
        function calcAndShowAddNodeValid() {
            const {nameValid, urlValid, chainIdValid} = Page.onAddNodeValidation(
                Page.$id(Page.ELEMENT_ID.NODES.NAME).val(),
                Page.$id(Page.ELEMENT_ID.NODES.URL).val(),
                Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).val()
            );
            Page.showAddNodeValid(nameValid, urlValid, chainIdValid);
        }

        Page.$id(Page.ELEMENT_ID.NODES.NAME).on('input', () => {
            calcAndShowAddNodeValid();
        });

        Page.$id(Page.ELEMENT_ID.NODES.URL).on('input', () => {
            calcAndShowAddNodeValid();
        });

        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).on('input', () => {
            calcAndShowAddNodeValid();
        });

        // <<< Add node validation

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            Page.showAlterWalletPrivateKeyWait(true);
            const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
            const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
            try {
                Page.onAlterWalletPrivateKeyAsync(privateKey0x)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletPrivateKeyWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletPrivateKeyError(err);
                        Page.showAlterWalletPrivateKeyWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletPrivateKeyError(e);
                Page.showAlterWalletPrivateKeyWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
            Page.showCurrentWallet();
            Page.showAlterWalletPrivateKeyError();
            Page.showAlterWalletFileError();
            Page.showAlterWalletFileWait(true);
            const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
            const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).val();
            try {
                Page.onAlterWalletFileAsync(file, password)
                    .then((walletInfo) => {
                        Page.showCurrentWallet(walletInfo);
                        Page.showAlterWalletFileWait(false);
                    })
                    .catch((err) => {
                        Page.showAlterWalletFileError(err);
                        Page.showAlterWalletFileWait(false);
                    });
            }
            catch (e) {
                Page.showAlterWalletFileError(e);
                Page.showAlterWalletFileWait(false);
            }
            return false;
        });
    },
    onNodeAdd() {},
    onNodeRemove() {},
    onNodeChange() {}
};

const Validator = {
    walletId(address) {
        if (address.substring(0, 2) !== '0x') {
            return false;
        } else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
            return false;
        } else {
            return true;
        }
    },
    url(url) {
        return /^https?:\/\/[^/]+/.test(url);
    },
    chainId(chainId) {
        return /^\d+$/.test(chainId);
    },
    privateKey(key) {
        const prefixLength = key.substring(0, 2) === '0x' ? 2 : 0;
        const keyDigits = key.length - prefixLength;
        return keyDigits === 64 || keyDigits ===128 || keyDigits === 132;
    },
    tokenCount(count) {
        return /^\d+$/.test(count);
    }
};

function onload() {
    function initNode() {
        const currentNode = Nodes.getCurrentNode();
        web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
        web3.eth.defaultAccount = web3.eth.coinbase;
    }

    try {
        initNode();
    }
    catch (e) {
        console.error(e);
    }
    Page.init();
    Page.setNodes(
        Nodes.getNodesNames(),
        Nodes.getCurrentNodeId(),
        Nodes.canRemoveNode(Nodes.getCurrentNodeId())
    );

    Page.onAddNodeValidation = (name, url, chainId) => {
        return {
            nameValid: !!name,
            urlValid: Validator.url(url),
            chainIdValid: Validator.chainId(chainId)
        };
    };

    Page.onNodeAdd = ({name, url, chainId: chainIdStr}) => {
        if (name && url && chainIdStr) {
            const chainId = +chainIdStr;
            const newNode = {
                name,
                url,
                chainId
            };
            const newNodeId = Nodes.addNode(newNode);
            web3.setProvider(new web3.providers.HttpProvider(url));
            return {
                id: newNodeId,
                node: newNode,
                canRemoveNode: Nodes.canRemoveNode(newNodeId)
            };
        } else {
            throw 'Fail to add node';
        }
    };

    Page.onNodeRemove = (idToRemove) => {
        const {id, node} = Nodes.removeNode(idToRemove);
        web3.setProvider(new web3.providers.HttpProvider(node.url));
        return {
            id,
            canRemoveNode: Nodes.canRemoveNode(id)
        };
    };

    Page.onNodeChange = (id) => {
        const currentNode = Nodes.setCurrentNodeId(id);
        web3.setProvider(new web3.providers.HttpProvider(currentNode.url));
        return Nodes.canRemoveNode(id);
    };

    Page.onAlterWalletValidation = (key, file) => {
        return {
            keyValid: Validator.privateKey(key),
            fileValid: !!file
        };
    };

    Page.onAlterWalletPrivateKeyAsync = (privateKey0x) => {
        currentWallet = null;
        const Wallet = ethers.Wallet;
        const currentNode = Nodes.getCurrentNode();
        const wallet = new Wallet(privateKey0x, new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId));
        return Ether.getWalletInfoAsync(wallet).then((info) => {
            currentWallet = {
                wallet,
                info
            };
            return currentWallet;
        });
    };

    Page.onAlterWalletFileAsync = (file, password) => {
        return readFileContentAsync(file)
            .then((content) => {
                const Wallet = ethers.Wallet;
                return Wallet.fromEncryptedWallet(content, password);
            })
            .then((wallet) => {
                const currentNode = Nodes.getCurrentNode();
                wallet.provider = new ethers.providers.JsonRpcProvider(currentNode.url, false, currentNode.chainId);
                const info = Ether.getWalletInfoAsync(wallet);
                const gasPrice = wallet.provider.getGasPrice();
                return Promise.all([info,gasPrice])
                    .then(([info, gasPrice]) => {
                        currentWallet = {
                            wallet,
                            info,
                            gasPrice
                        };
                        debugger;
                        return currentWallet;
                    });
            });
    };
}

$(onload);

