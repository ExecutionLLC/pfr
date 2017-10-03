sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "personal/account/model/Model",
    "sap/m/MessageBox",
    "personal/account/util/Const"
], function (UIComponent, JSONModel, Model, MessageBox, Const) {
    "use strict";
    return UIComponent.extend("personal.account.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            var ASYNC_UPDATE_TIMEOUT = Const.const.ASYNC_UPDATE_TIMEOUT;            // 30s
            // Снилс пользователя, который мы получили из окна авторизации
            var SNILS = "00000000101";
            var BASE_URL = Const.const.BASE_URL;

            // call the init function of the parent
            var oTechModel = new JSONModel(Model.modelStructure);
            this.setModel(oTechModel, "techModel");

            // Получаем адресс с данными для конкретного пользователя
            var personInfoURL = BASE_URL + "/person/" + SNILS;
            var npfsURL = BASE_URL + "/npfs";

            var oComponent = this;
            var oMainModel = new JSONModel();
            oComponent.setModel(oMainModel, "mainModel");

            var oListNPFModel = new JSONModel();
            oComponent.setModel(oListNPFModel,"npfModel");

            function updateModelAsync() {
                $.ajax({
                    url: personInfoURL,
                    dataType: "json"
                }).done(function (result) {
                    oMainModel.setData(result);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
                }).always(function () {
                    setTimeout(updateModelAsync.bind(this), ASYNC_UPDATE_TIMEOUT);
                });
            }

            $.ajax({
                url: personInfoURL,
                dataType: "json"
            }).done(function (result) {
                oMainModel.setData(result);
                oTechModel.setProperty("/tech/tariff",oMainModel.getData().tariff);                                     // установили тариф в тех модель
                $.ajax({
                    url: npfsURL,
                    dataType: "json"
                }).done(function (result) {
                    oListNPFModel.setData(result);
                    oComponent.getRouter().initialize();
                    setTimeout(updateModelAsync.bind(this), ASYNC_UPDATE_TIMEOUT);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
                    MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
                });
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
                MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
            });

            UIComponent.prototype.init.apply(this, arguments);
        }
    });
});