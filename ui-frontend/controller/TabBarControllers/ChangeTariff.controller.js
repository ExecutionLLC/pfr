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

            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/pendedTariffChanges", this.oMainModel.getContext("/pendedTariffChanges")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));
        },

        onMainModelChanges: function () {
            var snils = this.oMainModel.getProperty("/metadata/snils");
            if (!snils) {
                // user is logged off
                return;
            }

            var pendedTariffChanges = this.oMainModel.getProperty("/pendedTariffChanges");
            if (pendedTariffChanges.length === 0) {
                this.oTechModel.setProperty("/tech/changeTariffTab/isSliderChangeTariffEnabled", true);
                // fake event, which should restore right state of the button
                this.onChangeTariff();
                this.oTechModel.setProperty("/tech/changeTariffTab/changeTariffMessage", "");
            } else {
                this.oTechModel.setProperty("/tech/changeTariffTab/isButtonChangeTariffEnabled", false);
                this.oTechModel.setProperty("/tech/changeTariffTab/isSliderChangeTariffEnabled", false);
                this.oTechModel.setProperty("/tech/changeTariffTab/changeTariffMessage", "Заявка на рассмотрении");
            }
        },

        /**
         * @description Сбор информации о новом тарифе и отправка ее на сервер
         */
        onApplyChangeTariff: function () {
            var snils = this.oMainModel.getProperty("/metadata/snils");
            var baseUrl = Const.const.BASE_URL;
            var changeTariffUrl = baseUrl + "/person/" + snils + "/tariff";

            var selectedTariff = this.oTechModel.getProperty("/tech/changeTariffTab/selectedTariff");
            var pendedTariffChanges = this.oMainModel.getProperty("/pendedTariffChanges");
            var oNewTariff = {
                "tariff": selectedTariff
            };
            $.ajax({
                url: changeTariffUrl,
                dataType: "json",
                type: "PUT",
                data: JSON.stringify(oNewTariff),
                jsonp: false
            });
            this.oMainModel.setProperty("/pendedTariffChanges", pendedTariffChanges.concat([oNewTariff]));
        },

        /**
         * @description Смена значения слайдера для выбора тарифа
         */
        onChangeTariff: function () {
            var selectedTariff = this.oTechModel.getProperty("/tech/changeTariffTab/selectedTariff");
            var currentTarrif = this.oMainModel.getProperty("/tariff");
            this.oTechModel.setProperty("/tech/changeTariffTab/isButtonChangeTariffEnabled", selectedTariff !== currentTarrif);
        }
    });
});