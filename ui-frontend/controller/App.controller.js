sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "personal/account/util/Const"
], function (Controller, MessageBox, Const) {
    "use strict";
    return Controller.extend("personal.account.controller.App", {
        onEnter: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oLoginInput = this.getView().byId('loginInput');
            var oPasswordInput = this.getView().byId('passwordInput');

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
                oComponent.initModels(result.snils);
                oRouter.navTo("menuPage");
            }).fail(function (jqXHR, textStatus, errorThrown) {
                MessageBox.error("Неверный логин или пароль.");
                oLoginInput.setEnabled(true);
                oPasswordInput.setEnabled(true);
            });
        }
    });
});