sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const"
], function (Controller, formatter, Const) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.ChangeTarif", {
        formatter: formatter,
        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");

        },

        /**
         * @description Сбор информации о новом тарифе и отправка ее на сервер
         */
        onApplyChangeTariff: function () {
            var SNILS = "00000000101";
            var BASE_URL = Const.const.BASE_URL;
            var personInfoURL = BASE_URL + "/person/" + SNILS;
            var nNewTariff = this.oTechModel.getProperty("/tech/tariff");                                    // забрали новый тариф, который установил пользователь, из тех модели
            //var oMainModel = this.oComponent.getModel("mainModel");
            //oMainModel.setProperty("/tariff", oNewTariff);
            var oTechModel = this.oTechModel;
            var oNewTariff = {                                                                               // Формируем требуемый объект для отправки на сервер
                "tariff": nNewTariff
            };
            $.ajax({
                url:personInfoURL + "/tariff",
                dataType: "json",
                type:"PUT",
                data: JSON.stringify(oNewTariff),
                jsonp: false,
                success: function () {
                    oTechModel.setProperty("/tech/isButtonChangeTariffEnable", false);                         // Сделали кнопку невидимой

                }
            })
        },

        /**
         * @description Смена значения слайдера для выбора тарифа
         */
        onChangeTariff: function () {
            this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", true);           // Сделали кнопку "Сменить тариф" видимой
        }
    });
});