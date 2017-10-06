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
        }
    });
});