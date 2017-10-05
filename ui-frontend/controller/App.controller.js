sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/util/Const",
    "sap/m/MessageBox"
], function (Controller, Const, MessageBox) {
    "use strict";
    return Controller.extend("personal.account.controller.App", {
        onEnter: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oLoginInput = this.getView().byId('loginInput');
            var oPasswordInput = this.getView().byId('passwordInput');
            //var oTechModel = this.getOwnerComponent().getModel("techModel");

            var authData = {
                login: oLoginInput.getValue(),
                password: oPasswordInput.getValue()
            };
            oLoginInput.setEnabled(false);
            oPasswordInput.setEnabled(false);

            $.ajax({
                url: Const.const.LOGIN_URL,
                dataType: "json",
                type: "POST",
                jsonp: false,
                data: JSON.stringify(authData)
            }).done(function (result) {
                //oTechModel.setProperty("/tech/snils", result.snils);
                oRouter.navTo("menuPage");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                MessageBox.error("Неверный логин или пароль.");
                oLoginInput.setEnabled(true);
                oPasswordInput.setEnabled(true);
            });
        }
    });
});