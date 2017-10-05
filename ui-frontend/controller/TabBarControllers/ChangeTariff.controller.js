sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const"
], function (Controller, formatter, Const) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.ChangeTariff", {
        formatter: formatter,
        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");
        },

        /**
         * @description Сбор информации о новом тарифе и отправка ее на сервер
         */
        onApplyChangeTariff: function () {
            var snils = this.oMainModel.getProperty("/metadata/snils");
            var baseUrl = Const.const.BASE_URL;
            var changeTariffUrl = baseUrl + "/person/" + snils;
            var nNewTariff = this.oTechModel.getProperty("/tech/tariff");
            var pendedTariffChanges = this.oMainModel.getProperty("/pendedTariffChanges");
            var oNewTariff = {
                "tariff": nNewTariff
            };
            $.ajax({
                url: changeTariffUrl + "/tariff",
                dataType: "json",
                type: "PUT",
                data: JSON.stringify(oNewTariff),
                jsonp: false
            });
            this.oMainModel.setProperty("/pendedTariffChanges", pendedTariffChanges.concat([{tariff: nNewTariff}]));
            this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", false);
        },

        /**
         * @description Смена значения слайдера для выбора тарифа
         */
        onChangeTariff: function (oEvent) {
            var nNewTariff = oEvent.getParameter("value");
            var nOldTarrif = this.oMainModel.getProperty("/tariff");
            this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", nNewTariff !== nOldTarrif);
        }
    });
});