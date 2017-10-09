sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter"
], function (Controller, formatter) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Profile", {
        formatter: formatter,

        onInit: function () {
            var oComponent = this.getOwnerComponent();
            this.oTechModel = oComponent.getModel("techModel");
            this.oMainModel = oComponent.getModel("mainModel");
            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/", this.oMainModel.getContext("/")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));

            var oPopOver = this.getView().byId("idPopOver");
            var oVizFrame = this.getView().byId("idVizFrame");
            oPopOver.connect(oVizFrame.getVizUid());
        },

        onMainModelChanges: function() {
            var operationsHistory = this.oMainModel.getProperty("/operationsHistory");

            var diagramData = operationsHistory.map(function(value) {
                return {
                    amount: value.amount,
                    timestamp: value.timestamp
                };
            });

            for(var i = 1;i < diagramData.length;i++) {
                var obj = diagramData[i];
                obj.amount += diagramData[i - 1].amount;
            }

            this.oTechModel.setProperty("/tech/profileTab/diagramData", diagramData);
        },

        onNavigateToNPF: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("menuPage", {
                query: {
                    tab: "NPF"
                }
            }, true);
        },

        onNavigateChangeTariff: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("menuPage", {
                query: {
                    tab: "Rate"
                }
            }, true);
        },

        onChangeSelect: function (oEvent) {
            var oSelect = oEvent.getSource();
            var oItem = oSelect.getSelectedItem();
            var sSelectedKey = oItem.getKey();

            var oBinding = this.getView().byId("idVizFrame").getDataset().getBinding("data");
            if(sSelectedKey === "last-year") {
                var oneYearBeforeNow = new Date().setFullYear(new Date().getFullYear() - 1);
                var filter = new sap.ui.model.Filter("timestamp", sap.ui.model.FilterOperator.GE, oneYearBeforeNow);
                oBinding.filter([filter]);
            } else {
                oBinding.filter(null);
            }
        }
    });
});