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
            this.oMainModel = this.oComponent.getModel("mainModel");
        },

        /**
         * @description Сбор информации о новом тарифе и отправка ее на сервер
         */
        onApplyChangeTariff: function () {
            var SNILS = "00000000101";
            var BASE_URL = Const.const.BASE_URL;
            var personInfoURL = BASE_URL + "/person/" + SNILS;
            var nNewTariff = this.oTechModel.getProperty("/tech/tariff");                                    // забрали новый тариф, который установил пользователь, из тех модели
            var pendedTariffChanges = this.oMainModel.getProperty("/pendedTariffChanges");
            var oNewTariff = {                                                                               // Формируем требуемый объект для отправки на сервер
                "tariff": nNewTariff
            };
            $.ajax({
                url:personInfoURL + "/tariff",
                dataType: "json",
                type:"PUT",
                data: JSON.stringify(oNewTariff),
                jsonp: false
            });
            this.oMainModel.setProperty("/pendedTariffChanges", pendedTariffChanges.concat([{tariff: nNewTariff}]));
            this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", false);                                        // Сделали слайдер невидимым
        },

        /**
         * @description Смена значения слайдера для выбора тарифа
         */
        onChangeTariff: function (oEvent) {
            var nNewTariff = oEvent.getParameter("value");                                                  // выбранное значение на слайдере
            var nOldTarrif = this.oMainModel.getProperty("/tariff");                                             // Текущее значение тарифа для конкретного пользователя

            if(nNewTariff === nOldTarrif){
                this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", false);                     // Сделали кнопку "Сменить тариф" невидимой
            }else {
                this.oTechModel.setProperty("/tech/isButtonChangeTariffEnable", true);                      // Сделали кнопку "Сменить тариф" видимой
            }
        }
    });
});