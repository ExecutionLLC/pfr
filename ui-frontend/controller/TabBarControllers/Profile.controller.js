sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter"
], function (Controller,formatter) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Profile", {
        formatter: formatter,

        onNavToNPF:function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("changeNpf");
        }
    });
});