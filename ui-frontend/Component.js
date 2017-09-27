sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "personal/account/model/Model"
], function (UIComponent, JSONModel, Model) {
    "use strict";
    return UIComponent.extend("personal.account.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            var oTechModel = new JSONModel(Model.modelStructure.tech);
            this.setModel(oTechModel, "techModel")
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});