sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const",
    "personal/account/util/Utils",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, formatter, Const, Utils, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        formatter: formatter,

        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");
            this.enableSelectButtonTimerId = null;
            this.oResourceBundle = this.oComponent.getModel("i18n").getResourceBundle();


            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/", this.oMainModel.getContext("/")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));
        },

        enableSelectButton: function(enable, nextMinTimeForChanges) {
            if (nextMinTimeForChanges) {
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextMinTimeForChangeLabelVisible", true);
                var message = Utils.timestampToString(nextMinTimeForChanges, true);
                this.oTechModel.setProperty("/tech/changeNpfTab/nextMinTimeForChangeMessage", message);
                this.oTechModel.setProperty("/tech/changeNpfTab/isSelectButtonEnabled", false);
            } else {
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextMinTimeForChangeLabelVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/nextMinTimeForChangeMessage", "");
                this.oTechModel.setProperty("/tech/changeNpfTab/isSelectButtonEnabled", true);
            }
        },

        onMainModelChanges: function() {
            if(!this.oMainModel.getProperty("/metadata/snils")) {
                // user is logged out
                return;
            }

            var sRequestPendingText =this.oResourceBundle.getText("npf.men.exp.requestPendingText");
            var npfHistory = this.oMainModel.getProperty("/npfHistory");
            var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");

            var pendedNpfTableData = pendedNpfChanges.map(function (value) {
                return {
                    npf: value.npf,
                    timestamp: value.timestamp,
                    transactionHash: value.transactionHash,
                    isFinished: false
                };
            });
            var historyNpfTableData = npfHistory.map(function (value) {
                return {
                    npf: value.newNpf,
                    timestamp: value.timestamp,
                    transactionHash: value.transactionHash,
                    isFinished: true
                }
            });
            var totalnpfTableData = pendedNpfTableData.concat(historyNpfTableData);
            this.oTechModel.setProperty("/tech/changeNpfTab/npfTableData", totalnpfTableData);

            if (pendedNpfChanges.length !== 0) {
                this.oTechModel.setProperty("/tech/changeNpfTab/selectedNpf", "");
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", true);
                this.oTechModel.setProperty("/tech/changeNpfTab/isApplyButtonVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", sRequestPendingText);
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessageState", "Warning");
            } else {
                var changeNpfMessage = this.oTechModel.getProperty("/tech/changeNpfTab/changeNpfMessage");
                // FIXME
                if (changeNpfMessage === sRequestPendingText) {
                    this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "");
                }
            }

            var nextMinTimeForChanges = null;
            if (pendedNpfChanges.length !== 0) {
                var lastItem = pendedNpfChanges[pendedNpfChanges.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.TIME_NEXT_CHANGE_NPF;
            } else if (npfHistory.length !== 0) {
                var lastItem = npfHistory[npfHistory.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.TIME_NEXT_CHANGE_NPF;
            }

            var currentTime = +new Date();
            if (nextMinTimeForChanges && currentTime < nextMinTimeForChanges) {
                if (this.enableSelectButtonTimerId) {
                    clearTimeout(this.enableSelectButtonTimerId);
                }

                this.enableSelectButton(false, nextMinTimeForChanges);

                this.enableSelectButtonTimerId = setTimeout(function () {
                    this.enableSelectButton(true);
                    this.enableSelectButtonTimerId = null;
                }.bind(this), nextMinTimeForChanges - currentTime);
            } else {
                this.enableSelectButton(true);
            }
        },

        onSelectButton: function (oEvent) {
            var isNextNpfTableVisible = !this.oTechModel.getProperty("/tech/changeNpfTab/isNextNpfTableVisible");
            this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", isNextNpfTableVisible);
        },

        onSelectNpfTableItem: function (oEvent) {
            var oItem = oEvent.getSource();
            var oSelectedObject = oItem.getBindingContext("npfModel").getObject();
            var nSelectedNPFAdress = oSelectedObject.address;
            var selectedNpfName = oSelectedObject.name;
            var sApplyButtonTextChange = this.oResourceBundle.getText("npf.men.exp.applyButtonTextChange");
            this.oTechModel.setProperty("/tech/changeNpfTab/selectedNpfAdress", nSelectedNPFAdress);
            this.oTechModel.setProperty("/tech/changeNpfTab/selectedNpf", selectedNpfName);
            this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", false);
            this.oTechModel.setProperty("/tech/changeNpfTab/applyButtonText", sApplyButtonTextChange);
            this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", true);
            this.oTechModel.setProperty("/tech/changeNpfTab/isApplyButtonVisible", true);
            this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "");
        },

        onApplyButton: function () {
            var sApplyButtonTextChangeConfirm = this.oResourceBundle.getText("npf.men.exp.applyButtonTextChangeConfirm");
            var sConfirmQuestion = this.oResourceBundle.getText("npf.men.exp.confirmQuestion");
            var needConformation = this.oTechModel.getProperty("/tech/changeNpfTab/needConformation");
            if (needConformation) {
                this.oTechModel.setProperty("/tech/changeNpfTab/applyButtonText", sApplyButtonTextChangeConfirm);
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", sConfirmQuestion);
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessageType", "Error");
                this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", false);
            } else {
                var snils = this.oMainModel.getProperty("/metadata/snils");
                var baseUrl = Const.BASE_URL;
                var changeNpfURL = baseUrl + "/person/" + snils + "/npf";

                var selectedNpfAddress = this.oTechModel.getProperty("/tech/changeNpfTab/selectedNpfAdress");

                $.ajax({
                    url: changeNpfURL,
                    dataType: "json",
                    type: "PUT",
                    data: JSON.stringify({"npf": selectedNpfAddress}),
                    jsonp: false
                });

                var now = +new Date();
                var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");
                // состояние кнопок/лейблов/... следует состоянию модели, все изменения состояния GUI произойдут в onMainModelChanges
                this.oMainModel.setProperty("/pendedNpfChanges", pendedNpfChanges.concat([{
                    npf: selectedNpfAddress,
                    timestamp: now,
                    isFinished: false
                }]));
            }
        },

        onLinkPress: function (oEvent) {
            var oLink = oEvent.getSource();
            var transactionHash = oLink.getProperty("text");
            var transactionHashURL = Utils.formatTransactionHashHref(transactionHash);
            Utils.showMessageBoxHashInfo.call(this, transactionHashURL);
        }
    });
});