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
        },
        PFR: {
            CONTAINER: 'pfr-ops',
            ADD_WORKER: {
                GROUP: 'add-worker-group',
                NPF_SELECT: 'add-worker-select-npf',
                ADDRESS: 'add-worker-address',
                SNILS: 'add-worker-snils',
                TARIFF: 'add-worker-tariff',
                BUTTON: 'add-worker-button',
                WAIT: 'add-worker-wait',
                ERROR: 'add-worker-error',
                TRANSACTION_WAIT: 'add-worker-transaction-waiting',
                TRANSACTION_COMPLETE: 'add-worker-transaction-completed',
                TRANSACTION_FAILED: 'add-worker-transaction-failed'
            },
            INFO_WORKER: {
                GROUP: 'info-worker-group',
                NPF: 'info-worker-npf',
                SNILS: 'info-worker-snils',
                TARIFF: 'info-worker-tariff',
                BUTTON: 'info-worker-button',
                WAIT: 'info-worker-wait',
                ERROR: 'info-worker-error',
                TRANSACTION_WAIT: 'info-worker-transaction-waiting',
                TRANSACTION_COMPLETE: 'info-worker-transaction-completed',
                TRANSACTION_FAILED: 'info-worker-transaction-failed'
            },
            ADD_NPF: {
                GROUP: 'add-npf-group',
                NAME: 'add-npf-name',
                ADDRESS: 'add-npf-address',
                BUTTON: 'add-npf-button',
                WAIT: 'add-npf-wait',
                ERROR: 'add-npf-error',
                TRANSACTION_WAIT: 'add-npf-transaction-waiting',
                TRANSACTION_COMPLETE: 'add-npf-transaction-completed',
                TRANSACTION_FAILED: 'add-npf-transaction-failed'
            },
            ADD_BANK: {
                GROUP: 'add-bank-group',
                NAME: 'add-bank-name',
                ADDRESS: 'add-bank-address',
                BUTTON: 'add-bank-button',
                WAIT: 'add-bank-wait',
                ERROR: 'add-bank-error',
                TRANSACTION_WAIT: 'add-bank-transaction-waiting',
                TRANSACTION_COMPLETE: 'add-bank-transaction-completed',
                TRANSACTION_FAILED: 'add-bank-transaction-failed'
            },
            SHOW_NPF: {
                BUTTON: 'info-npf-button',
                LIST: 'info-npf-list'
            },
            SHOW_BANK: {
                BUTTON: 'info-bank-button',
                LIST: 'info-bank-list'
            }
        },
        NPF: {
            CONTAINER: 'npf-ops',
            GET_TARIFF: {
                GROUP: 'npf-get-tariff-group',
                SNILS: 'npf-get-tariff-snils',
                TARIFF: 'npf-get-tariff-tariff',
                BUTTON: 'npf-get-tariff-button',
                ERROR: 'npf-get-tariff-error'
            },
            ADD_OPERATION: {
                GROUP: 'npf-add-operation-group',
                COUNT: 'npf-add-operation-count',
                SNILS: 'npf-add-operation-snils',
                COMMENT: 'npf-add-operation-comment',
                BUTTON: 'npf-add-operation-button',
                WAIT: 'npf-add-operation-wait',
                ERROR: 'npf-add-operation-error',
                TRANSACTION_WAIT: 'npf-add-operation-transaction-waiting',
                TRANSACTION_COMPLETE: 'npf-add-operation-transaction-completed',
                TRANSACTION_FAILED: 'npf-add-operation-transaction-failed'
            },
        },
        BANK: {
            CONTAINER: 'bank-ops'
        },
        WORKER: {
            CONTAINER: 'worker-ops',
            TAB: 'worker-npf-change',
            SHOW_HISTORY: {
                BUTTON: 'worker-history-button',
                LIST: 'worker-history-list'
            },
            SET_TARIFF: {
                GROUP: 'worker-npf-tarif-set-tarif-group',
                TARIFF: 'worker-npf-tarif-set-tarif-tarif',
                BUTTON: 'worker-npf-tarif-set-tarif-button',
                WAIT: 'worker-npf-tarif-set-tarif-wait',
                ERROR: 'worker-npf-tarif-set-tarif-error',
                TRANSACTION_WAIT: 'worker-npf-tarif-set-tarif-transaction-waiting',
                TRANSACTION_COMPLETE: 'worker-npf-tarif-set-tarif-transaction-completed',
                TRANSACTION_FAILED: 'worker-npf-tarif-set-tarif-transaction-failed'
            },
            SET_NPF: {
                GROUP: 'worker-npf-tarif-select-npf-group',
                NPF: 'worker-npf-tarif-select-npf-npf',
                BUTTON: 'worker-npf-tarif-select-npf-button',
                WAIT: 'worker-npf-tarif-select-npf-wait',
                ERROR: 'worker-npf-tarif-select-npf-error',
                TRANSACTION_WAIT: 'worker-npf-tarif-select-npf-transaction-waiting',
                TRANSACTION_COMPLETE: 'worker-npf-tarif-select-npf-transaction-completed',
                TRANSACTION_FAILED: 'worker-npf-tarif-select-npf-transaction-failed'
            },
            CURRENT_TARIFF: {
                TARIFF: 'worker-npf-tarif-current-tarif',
                NPF: 'worker-npf-tarif-current-npf',
            }
        },
        EMPLOYER: {
            CONTAINER: 'employer-ops'
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
    showNodeError(error) {
        Page.$id(Page.ELEMENT_ID.NODES.NODE_ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddNodeValid(nameValid, urlValid, chainIdValid) {
        const allValid = nameValid && urlValid && chainIdValid;
        Page.$id(Page.ELEMENT_ID.NODES.ADD_NODE_GROUP).toggleClass('has-error', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.ADD).prop('disabled', !allValid);
        Page.$id(Page.ELEMENT_ID.NODES.NAME).toggleClass('alert-danger', !nameValid);
        Page.$id(Page.ELEMENT_ID.NODES.URL).toggleClass('alert-danger', !urlValid);
        Page.$id(Page.ELEMENT_ID.NODES.CHAIN_ID).toggleClass('alert-danger', !chainIdValid);
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
    showCurrentWallet(walletType) {
        if (!walletType) {
            Page.$id(Page.ELEMENT_ID.PFR.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.NPF.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.BANK.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.WORKER.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.EMPLOYER.CONTAINER).toggle(false);
            return Promise.resolve();
        }

        function showInfo() {
            if (walletType === 'PFR') {
                Page.setPfrNpfs(AppState.getNpfs());
                Page.$id(Page.ELEMENT_ID.PFR.CONTAINER).toggle(true);
                return Promise.resolve();
            } else if (walletType === 'NPF') {
                Page.$id(Page.ELEMENT_ID.NPF.CONTAINER).toggle(true);

                return Promise.resolve();
            } else if (walletType === 'BANK') {
                Page.$id(Page.ELEMENT_ID.BANK.CONTAINER).toggle(true);
                return Promise.resolve();
            } else if (walletType === 'WORKER') {
                Page.setWorkerNpfs(AppState.getNpfs());
                Page.$id(Page.ELEMENT_ID.WORKER.CONTAINER).toggle(true);
                return Promise.resolve();
            } else {
                Page.$id(Page.ELEMENT_ID.EMPLOYER.CONTAINER).toggle(true);
                return Promise.resolve();
            }
        }

        return showInfo()
    },
    setPfrNpfs(npfs) {
        $.each(npfs, (i, {name, owner}) => {
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.NPF_SELECT)
                .append($('<option></option>')
                    .attr("value", owner)
                    .text(name));
        });
    },
    setWorkerNpfs(npfs) {
        $.each(npfs, (i, {name, owner}) => {
            Page.$id(Page.ELEMENT_ID.WORKER.SET_NPF.NPF)
                .append($('<option></option>')
                    .attr("value", owner)
                    .text(name));
        });
    },

    addWorkerState: {
        _isWaiting: false,
        _showCurrentState() {
            const isWaiting = Page.addWorkerState._isWaiting;
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.ADDRESS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.NPF_SELECT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.TARIFF).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.SNILS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.BUTTON).prop('disabled', isWaiting);
        },
        init() {
            Page.addWorkerState._isWaiting = false;
            Page.addWorkerState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.addWorkerState._isWaiting = isWait;
            Page.addWorkerState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.addWorkerState._showCurrentState();
        }
    },
    showTransaction(ids, id, complete, fail) {
        const $wait = Page.$id(ids.TRANSACTION_WAIT);
        const $complete = Page.$id(ids.TRANSACTION_COMPLETE);
        const $failed = Page.$id(ids.TRANSACTION_FAILED);
        $wait.hide();
        $complete.hide();
        $failed.hide();
        if (id == null) {
            return;
        }
        const $caption = complete ?
            fail ?
                $failed :
                $complete :
            $wait;
        const templateText = $caption.data('template');
        const text = templateText.replace('%', id);
        $caption.text(text).show();
    },
    showAddWorkerError(error) {
        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddWorkerTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.PFR.ADD_WORKER, id, complete, fail);
    },

    init() {
        Page.showNodeError();
        Page.showAddNodeError();
        Page.showAlterWalletPrivateKeyWait(false);
        Page.showAlterWalletFileWait(false);
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        Page.nodesState.init();
        Page.addWorkerState.init();
        // Page.infoWorkerState.init();
        // Page.addBankState.init();
        // Page.addNpfState.init();
        // Page.npfAddOperationState.init();
        // Page.workerSetTariffState.init();
        // Page.workerSetNpfState.init();

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
            Page.showCurrentWallet()
                .then(() => {
                    Page.showAlterWalletPrivateKeyError();
                    Page.showAlterWalletFileError();
                    Page.showAlterWalletPrivateKeyWait(true);
                    const privateKey = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.PRIVATE_KEY.KEY).val();
                    const privateKey0x = /^0x/.test(privateKey) ? privateKey : `0x${privateKey}`;
                    const {url, chainId} = Nodes.getCurrentNode();
                    try {
                        const wallet = Api.createWalletByPrivateKey(privateKey0x, url, chainId);
                        AppState.setWallet(wallet);
                        return Api.getNpfs()
                            .then((npfs) => {
                                AppState.setNpfs(npfs);
                                return Api.getWalletType(wallet)
                            })
                            .then((walletType) => {
                                return Page.showCurrentWallet(walletType)
                                    .then(()=> {
                                        Page.showAlterWalletPrivateKeyWait(false)

                                    });
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
                });

            return false;
        });

        Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.BUTTON).click(() => {
            Page.showCurrentWallet()
                .then(() => {
                    Page.showAlterWalletPrivateKeyError();
                    Page.showAlterWalletFileError();
                    Page.showAlterWalletFileWait(true);
                    const file = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.FILE)[0].files[0];
                    const password = Page.$id(Page.ELEMENT_ID.ALTER_WALLET.FILE.PASSWORD).val();
                    const {url, chainId} = Nodes.getCurrentNode();
                    try {
                        Api.createWalletByFilePassword(file, password, url, chainId)
                            .then((wallet)=>{
                                AppState.setWallet(wallet);
                                return Api.getNpfs()
                                    .then((npfs) => {
                                        AppState.setNpfs(npfs);
                                        return Api.getWalletType(wallet)
                                    })
                            })
                            .then((walletType) => {
                                return Page.showCurrentWallet(walletType)
                                    .then(()=> {
                                        Page.showAlterWalletFileWait(false)

                                    });
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
                });

            return false;
        });

        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.TARIFF).on('input', (e) => {
            if (e.target.value.indexOf(".") != '-1') {
                e.target.value = e.target.value.substring(0, e.target.value.indexOf(".") + 3);
            }
            const parsedValue = parseFloat(e.target.value);
            if (parsedValue > 6) {
                e.target.value = "6";
            }
            if (parsedValue < 0) {
                e.target.value = "0";
            }
        });

        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.BUTTON).click(() => {
            Page.showAddWorkerError();
            Page.showAddWorkerTransaction();
            Page.addWorkerState.toggleWait(true);
            const address = Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.ADDRESS).val();
            const npf = Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.NPF_SELECT).val();
            const tariff = +Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.TARIFF).val();
            const snils = Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.SNILS).val();
            try {
                let transactionId;

                function onTransactionId(id) {
                    transactionId = id;
                    Page.showAddWorkerTransaction(id, false);
                }

                Page.onAddWorkerAsync(address, npf, snils, tariff, onTransactionId)
                    .then(() => {
                        Page.addWorkerState.toggleWait(false);
                        Page.showAddWorkerTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showAddWorkerError(err);
                        Page.addWorkerState.toggleWait(false);
                        Page.showAddWorkerTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showAddWorkerError(e);
                Page.addWorkerState.toggleWait(false);
            }
            return false;
        });


        return Page.showCurrentWallet();
    }
};

function onload() {
    const currentNode = Nodes.getCurrentNode();
    Api.init(currentNode);
    Page.init()
        .then(() => {
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
                    Api.setWeb3Provider(url);
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
                Api.setWeb3Provider(url);
                return {
                    id,
                    canRemoveNode: Nodes.canRemoveNode(id)
                };
            };

            Page.onNodeChange = (id) => {
                const currentNode = Nodes.setCurrentNodeId(id);
                Api.setWeb3Provider(currentNode.url);
                return Nodes.canRemoveNode(id);
            };

            Page.onAlterWalletValidation = (key, file) => {
                return {
                    keyValid: Validator.privateKey(key),
                    fileValid: !!file
                };
            };
        });

}

$(onload);
