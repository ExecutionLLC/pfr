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
            SHOW_HISTORY: {
                BUTTON: 'worker-history-button',
                LIST: 'worker-history-list'
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
    setNpfs(npfs) {
        $.each(npfs, (i, {name, owner}) => {
            Page.appendNpf(owner, name);
        });
    },
    clearNpfs() {
        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.NPF_SELECT)
            .find('option')
            .each(
                (_, $el,) => $el.remove()
            );
    },
    appendNpf(value, name) {
        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.NPF_SELECT)
            .append($('<option></option>')
                .attr("value", value)
                .text(name));
    },
    showCurrentWallet(walletInfo) {
        if (!walletInfo) {
            Page.$id(Page.ELEMENT_ID.PFR.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.NPF.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.BANK.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.WORKER.CONTAINER).toggle(false);
            Page.$id(Page.ELEMENT_ID.EMPLOYER.CONTAINER).toggle(false);
            return
        }

        if (walletInfo.info.accountType === 'PFR') {
            Page.$id(Page.ELEMENT_ID.PFR.CONTAINER).toggle(true);
        } else if (walletInfo.info.accountType === 'NPF') {
            Page.$id(Page.ELEMENT_ID.NPF.CONTAINER).toggle(true);
        } else if (walletInfo.info.accountType === 'BANK') {
            Page.$id(Page.ELEMENT_ID.BANK.CONTAINER).toggle(true);
        } else if (walletInfo.info.accountType === 'WORKER') {
            Page.$id(Page.ELEMENT_ID.WORKER.CONTAINER).toggle(true);
        } else {
            Page.$id(Page.ELEMENT_ID.EMPLOYER.CONTAINER).toggle(true);
        }

        Page.clearNpfs();
        Page.setNpfs(walletInfo.info.npfs);
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

    infoWorkerState: {
        _isWaiting: false,
        _showCurrentState() {
            const isWaiting = Page.infoWorkerState._isWaiting;
            Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.SNILS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.BUTTON).prop('disabled', isWaiting);
        },
        init() {
            Page.infoWorkerState._isWaiting = false;
            Page.infoWorkerState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.infoWorkerState._isWaiting = isWait;
            Page.infoWorkerState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.infoWorkerState._showCurrentState();
        }
    },
    showInfoWorkerError(error) {
        Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.ERROR)
            .text(error)
            .toggle(error != null);
    },
    addNpfState: {
        _isWaiting: false,
        _showCurrentState() {
            const isWaiting = Page.addNpfState._isWaiting;
            Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.ADDRESS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.NAME).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.BUTTON).prop('disabled', isWaiting);
        },
        init() {
            Page.addNpfState._isWaiting = false;
            Page.addNpfState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.addNpfState._isWaiting = isWait;
            Page.addNpfState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.addNpfState._showCurrentState();
        }
    }
    ,
    showAddNpfError(error) {
        Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddNpfTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.PFR.ADD_NPF, id, complete, fail);
    },
    addBankState: {
        _isWaiting: false,
        _showCurrentState() {
            const isWaiting = Page.addBankState._isWaiting;
            Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.ADDRESS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.NAME).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.BUTTON).prop('disabled', isWaiting);
        },
        init() {
            Page.addBankState._isWaiting = false;
            Page.addBankState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.addBankState._isWaiting = isWait;
            Page.addBankState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.addBankState._showCurrentState();
        }
    },
    showAddBankError(error) {
        Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showAddBankTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.PFR.ADD_BANK, id, complete, fail);
    },
    npfAddOperationState: {
        _isWaiting: false,
        _showCurrentState() {
            const isWaiting = Page.npfAddOperationState._isWaiting;
            Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.COUNT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.SNILS).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.COMMENT).prop('disabled', isWaiting);
            Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.WAIT).css('visibility', isWaiting ? 'visible' : 'hidden');
            Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.BUTTON).prop('disabled', isWaiting);
        },
        init() {
            Page.npfAddOperationState._isWaiting = false;
            Page.npfAddOperationState._showCurrentState();
        },
        toggleWait(isWait) {
            Page.npfAddOperationState._isWaiting = isWait;
            Page.npfAddOperationState._showCurrentState();
        },
        toggleValid(isValid) {
            Page.npfAddOperationState._showCurrentState();
        }
    },
    showNpfAddOperationError(error) {
        Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.ERROR)
            .text(error)
            .toggle(error != null);
    },
    showNpfAddOperationTransaction(id, complete, fail) {
        Page.showTransaction(Page.ELEMENT_ID.NPF.ADD_OPERATION, id, complete, fail);
    },


    init() {
        Page.showNodeError();
        Page.showAddNodeError();
        Page.showAlterWalletPrivateKeyWait(false);
        Page.showAlterWalletFileWait(false);
        Page.showAlterWalletPrivateKeyError();
        Page.showAlterWalletFileError();
        Page.showCurrentWallet();
        Page.nodesState.init();
        Page.addWorkerState.init();
        Page.infoWorkerState.init();
        Page.addBankState.init();
        Page.addNpfState.init();
        Page.npfAddOperationState.init();

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

        Page.$id(Page.ELEMENT_ID.PFR.ADD_WORKER.TARIFF).on('input', (e) => {
            if (e.target.value.indexOf(".") != '-1') {
                e.target.value = e.target.value.substring(0, e.target.value.indexOf(".") + 3);
            }
            const parsedValue = parseFloat(e.target.value)
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

        Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.BUTTON).click(() => {
            Page.showInfoWorkerError();
            Page.infoWorkerState.toggleWait(true);
            const snils = Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.SNILS).val();
            try {

                Page.onInfoWorkerAsync(snils)
                    .then(() => {
                        Page.infoWorkerState.toggleWait(false);
                    })
                    .catch((err) => {
                        Page.showInfoWorkerError(err);
                        Page.infoWorkerState.toggleWait(false);
                    })
            }
            catch (e) {
                Page.showInfoWorkerError(e);
                Page.infoWorkerState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.BUTTON).click(() => {
            Page.showAddNpfError();
            Page.showAddNpfTransaction();
            Page.addNpfState.toggleWait(true);
            const address = Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.ADDRESS).val();
            const name = Page.$id(Page.ELEMENT_ID.PFR.ADD_NPF.NAME).val();
            try {
                let transactionId;

                function onTransactionId(id) {
                    transactionId = id;
                    Page.showAddNpfTransaction(id, false);
                }

                Page.onAddNpfAsync(address, name, onTransactionId)
                    .then(() => {
                        Page.addNpfState.toggleWait(false);
                        Page.showAddNpfTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showAddNpfError(err);
                        Page.addNpfState.toggleWait(false);
                        Page.showAddNpfTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showAddNpfError(e);
                Page.addNpfState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.BUTTON).click(() => {
            Page.showAddBankError();
            Page.showAddBankTransaction();
            Page.addBankState.toggleWait(true);
            const address = Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.ADDRESS).val();
            const name = Page.$id(Page.ELEMENT_ID.PFR.ADD_BANK.NAME).val();
            try {
                let transactionId;

                function onTransactionId(id) {
                    transactionId = id;
                    Page.showAddBankTransaction(id, false);
                }

                Page.onAddBankAsync(address, name, onTransactionId)
                    .then(() => {
                        Page.addBankState.toggleWait(false);
                        Page.showAddBankTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showAddBankError(err);
                        Page.addBankState.toggleWait(false);
                        Page.showAddBankTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showAddBankError(e);
                Page.addBankState.toggleWait(false);
            }
            return false;
        });

        Page.$id(Page.ELEMENT_ID.PFR.SHOW_NPF.BUTTON).click(() => {

            Page.$id(Page.ELEMENT_ID.PFR.SHOW_NPF.LIST).empty();
            Ether.getNpfs()
                .then((npfs) => {
                    return new Promise(resolve => {
                        $.each(npfs, (i, {name, owner}) => {
                            Page.$id(Page.ELEMENT_ID.PFR.SHOW_NPF.LIST)
                                .append($('<li></li>')
                                    .addClass("list-group-item")
                                    .text(`${name}(${owner})`));
                        });
                        resolve();
                    });
                });
            return false;
        });

        Page.$id(Page.ELEMENT_ID.PFR.SHOW_BANK.BUTTON).click(() => {

            Page.$id(Page.ELEMENT_ID.PFR.SHOW_BANK.LIST).empty();
            Ether.getBanks()
                .then((banks) => {
                    return new Promise(resolve => {
                        $.each(banks, (i, {name, owner}) => {
                            Page.$id(Page.ELEMENT_ID.PFR.SHOW_BANK.LIST)
                                .append($('<li></li>')
                                    .addClass("list-group-item")
                                    .text(`${name}(${owner})`));
                        });
                        resolve();
                    });
                });
            return false;
        });
        
        Page.$id(Page.ELEMENT_ID.WORKER.SHOW_HISTORY.BUTTON).click(() => {

            Page.$id(Page.ELEMENT_ID.WORKER.SHOW_HISTORY.LIST).empty();
            Ether.getWorkerHistory()
                .then((history) => {
                    return new Promise(resolve => {
                        $.each(history, (i, {owner, npf, timestamp, amount, comment}) => {
                            Page.$id(Page.ELEMENT_ID.WORKER.SHOW_HISTORY.LIST)
                                .append($('<li></li>')
                                    .addClass("list-group-item")
                                    .text(`${moment(timestamp * 1000).format('DD.MM.YY HH:mm:ss')} ; ${npf} ; ${amount} ; ${comment}`));
                        });
                        resolve();
                    });
                });
            return false;
        });
        
        Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.BUTTON).click(() => {
            const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
            const snils = Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.SNILS).val();
            contract.personInfo(snils)
                .then((personInfo) => {
                    const {npf, tariff} = personInfo;
                    const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                    const gasPrice = currentWallet.wallet.provider.getGasPrice();
                    function strNullPersent(s) {
                        return `${s == null ? '...' : 'Tariff:  ' + parseFloat(s) / 100} %`;
                    }

                    const isCurrentNpf = npf == currentWallet.wallet.address;
                    Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.TARIFF).css('visibility', isCurrentNpf ? 'visible' : 'hidden');
                    Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.ERROR).css('visibility', !isCurrentNpf ? 'visible' : 'hidden');
                    if (isCurrentNpf) {
                        Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.TARIFF).text(strNullPersent(tariff));
                        Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.ERROR).text('');
                    }else {
                        Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.TARIFF).text('');
                        Page.$id(Page.ELEMENT_ID.NPF.GET_TARIFF.ERROR).text('Error: Snils doesn\'t belongs to this npf');
                    }
                    return Promise.all([info, gasPrice]);
                })
                .then(([info, gasPrice]) => {
                    currentWallet = {
                        wallet: currentWallet.wallet,
                        info,
                        gasPrice
                    };
                    Page.showCurrentWallet(currentWallet);
                });


            return false;
        });

        Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.BUTTON).click(() => {
            Page.showNpfAddOperationError();
            Page.showNpfAddOperationTransaction();
            Page.npfAddOperationState.toggleWait(true);
            const comment = Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.COMMENT).val();
            const count = +Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.COUNT).val();
            const snils = Page.$id(Page.ELEMENT_ID.NPF.ADD_OPERATION.SNILS).val();
            try {
                let transactionId;

                function onTransactionId(id) {
                    transactionId = id;
                    Page.showNpfAddOperationTransaction(id, false);
                }

                Page.onNpfAddOperationAsync(snils, count, comment, onTransactionId)
                    .then(() => {
                        Page.npfAddOperationState.toggleWait(false);
                        Page.showNpfAddOperationTransaction(transactionId, true);
                    })
                    .catch((err) => {
                        Page.showNpfAddOperationError(err);
                        Page.npfAddOperationState.toggleWait(false);
                        Page.showNpfAddOperationTransaction(transactionId, true, true);
                    })
            }
            catch (e) {
                Page.showNpfAddOperationError(e);
                Page.npfAddOperationState.toggleWait(false);
            }
            return false;
        });

    },
    onNodeAdd() {
    },
    onNodeRemove() {
    },
    onNodeChange() {
    }
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
        return keyDigits === 64 || keyDigits === 128 || keyDigits === 132;
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
                return Promise.all([info, gasPrice])
                    .then(([info, gasPrice]) => {
                        currentWallet = {
                            wallet,
                            info,
                            gasPrice
                        };
                        return currentWallet;
                    });
            });
    };

    Page.onAddWorkerAsync = (address, npf, snils, tariff, onTransaction) => {
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        const convert_tariff = tariff * 100;
        return contract.createPerson(address, snils, npf, convert_tariff)
            .then((buyTransaction) => {
                const {hash} = buyTransaction;
                onTransaction(hash);
                return new Promise((resolve) => {
                    currentWallet.wallet.provider.once(hash, (transaction) => {
                        console.log(transaction);
                        resolve();
                    });
                });
            })
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice = currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info, gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    Page.onNpfAddOperationAsync = (snils, count, comment, onTransaction) => {
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        debugger;
        return contract.addOperationHistory(snils, count, comment)
            .then((buyTransaction) => {
                const {hash} = buyTransaction;
                onTransaction(hash);
                return new Promise((resolve) => {
                    currentWallet.wallet.provider.once(hash, (transaction) => {
                        console.log(transaction);
                        resolve();
                    });
                });
            })
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice = currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info, gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    Page.setUpWorkerInfo = (npf, tariff) => {
        Ether.getNpfs()
            .then((npfs) => {
                const npfList = npfs.filter((item) => {
                    return item.owner.toLowerCase() == npf.toLowerCase();
                });

                function strNullPersent(s) {
                    return `${s == null ? '...' : parseFloat(s) / 100} %`;
                }

                function strNullNpf(s) {
                    return s == null ? '...' : `${s.name} (${s.owner})`;
                }

                Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.TARIFF).text(strNullPersent(tariff));
                Page.$id(Page.ELEMENT_ID.PFR.INFO_WORKER.NPF).text(strNullNpf(npfList[0]));
            });


    };

    Page.onInfoWorkerAsync = (snils,) => {
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        return contract.personInfo(snils)
            .then((personInfo) => {
                const {npf, tariff} = personInfo;
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice = currentWallet.wallet.provider.getGasPrice();
                const setupInfo = Page.setUpWorkerInfo(npf, tariff);
                return Promise.all([info, gasPrice, setupInfo]);
            })
            .then(([info, gasPrice, setupInfo]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    Page.onAddNpfAsync = (address, name, onTransaction) => {
        const isActive = true;
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        return contract.createNpf(address, name, isActive)
            .then((buyTransaction) => {
                const {hash} = buyTransaction;
                onTransaction(hash);
                return new Promise((resolve) => {
                    currentWallet.wallet.provider.once(hash, (transaction) => {
                        console.log(transaction);
                        resolve();
                    });
                });
            })
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice = currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info, gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };

    Page.onAddBankAsync = (address, name, onTransaction) => {
        const isActive = true;
        const contract = new ethers.Contract(CONTRACT.ID, CONTRACT.ABI, currentWallet.wallet);
        return contract.createBank(address, name, isActive)
            .then((buyTransaction) => {
                const {hash} = buyTransaction;
                onTransaction(hash);
                return new Promise((resolve) => {
                    currentWallet.wallet.provider.once(hash, (transaction) => {
                        console.log(transaction);
                        resolve();
                    });
                });
            })
            .then(() => {
                const info = Ether.getWalletInfoAsync(currentWallet.wallet);
                const gasPrice = currentWallet.wallet.provider.getGasPrice();
                return Promise.all([info, gasPrice]);
            })
            .then(([info, gasPrice]) => {
                currentWallet = {
                    wallet: currentWallet.wallet,
                    info,
                    gasPrice
                };
                Page.showCurrentWallet(currentWallet);
            });
    };
}

$(onload);

