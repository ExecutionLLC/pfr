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
            var oMainModel = new JSONModel();
            this.setModel(oMainModel, "mainModel");
            var oTechModel = new JSONModel(Model.modelStructure);
            this.setModel(oTechModel, "techModel");
            var oListNpfModel = new JSONModel();
            this.setModel(oListNpfModel,"npfModel");

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        },
        initModels: function(snils) {
            console.log(snils);

            if (this.updateTimeoutId) {
                clearTimeout(this.updateTimeoutId);
                this.updateTimeoutId = null;
            }

            var baseUrl = Const.const.BASE_URL;
            var personInfoURL = baseUrl + "/person/" + snils;
            var npfsURL = baseUrl + "/npfs";

            console.log(personInfoURL);
            console.log(npfsURL);

            var oMainModel = this.getModel("mainModel");
            var oTechModel = this.getModel("techModel");
            var oNpfModel = this.getModel("npfModel");

            var scheduleNextUpdate = this.scheduleNextModelsUpdate();

            $.ajax({
                url: personInfoURL,
                dataType: "json"
            }).done(function (personInfoResult) {
                $.ajax({
                    url: npfsURL,
                    dataType: "json"
                }).done(function (npfsResult) {
                    oNpfModel.setData(npfsResult);
                    oMainModel.setData(personInfoResult);
                    oTechModel.setProperty("/tech/tariff", oMainModel.getData().tariff);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Cannot update model data: textStatus = ', textStatus, ', error = ', errorThrown);
                    MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
                });
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
                MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
            });
        },
        updateModels: function() {
            var oMainModel = this.getModel("mainModel");

            var snils = oMainModel.getProperty("snils");
            var baseUrl = Const.const.BASE_URL;
            var personInfoURL = baseUrl + "/person/" + snils;

            var onAlways = this.scheduleNextModelsUpdate;
            $.ajax({
                url: personInfoURL,
                dataType: "json"
            }).done(function (result) {
                oMainModel.setData(result);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
            }).always(onAlways.bind(this));
        },
        scheduleNextModelsUpdate: function() {
            if (this.updateTimeoutId) {
                clearTimeout(this.updateTimeoutId);
            }
            var timeout = Const.const.ASYNC_UPDATE_TIMEOUT || 60*1000;
            this.updateTimeoutId = setTimeout(this.updateModels.bind(this), timeout);
        }
    });
});