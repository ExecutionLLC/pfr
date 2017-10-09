sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter"
], function (Controller,formatter) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Profile", {
        formatter: formatter,

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
                var oneYearBeforeNow = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
                var filter = new sap.ui.model.Filter("timestamp", sap.ui.model.FilterOperator.GT, oneYearBeforeNow);
                oBinding.filter([filter]);
            } else {
                oBinding.filter(null);
            }
        }
    });
});