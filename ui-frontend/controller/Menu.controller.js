sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("personal.account.controller.Menu", {
        onSelectTab: function (oEvent) {
            var oNavCon = this.getView().byId('navCon');
            var sKey = oEvent.getParameter('key');
            oNavCon.to(this.getView().byId(sKey),"show");
        }
    });
});