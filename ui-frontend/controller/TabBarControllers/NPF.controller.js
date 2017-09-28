sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        onColumnListItemPress:function () {
            var oComponent = this.getOwnerComponent();
            var oTechModel = oComponent.getModel("techModel");
            //var oData = oTechModel.getData();
            //oData.isButtonShowNPFApply = false;
            oTechModel.setProperty("/isButtonShowNPFApply",false,'',true)
        }
    });
});