sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "personal/account/model/Model",
    "sap/m/MessageBox"
], function (UIComponent, JSONModel, Model, MessageBox) {
    "use strict";
    return UIComponent.extend("personal.account.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            var oTechModel = new JSONModel(Model.modelStructure);
            this.setModel(oTechModel, "techModel");


            /*// Подключили данные для таблицы выписки
            var oTableModel = new JSONModel();
            oTableModel.loadData("./test/TableData.json","",false);
            this.setModel(oTableModel, "tableModel");

            // Подключили данные для таблицы смены тарифа
            var oTableModelTarif = new JSONModel();
            oTableModelTarif.loadData("./test/TableDataChangeTarif.json","",false);
            this.setModel(oTableModelTarif, "tableModelChangeTarif");

            // Подключили данные для таблицы для смены НПФ
            var oTableModelNPF = new JSONModel();
            oTableModelNPF.loadData("./test/TableDataNPF.json","",false);
            this.setModel(oTableModelNPF, "tableModelNPF");

            // Подключили данные для таблицы для списка НПФ
            var oTableModelNPF2 = new JSONModel();
            oTableModelNPF2.loadData("./test/NPF.json","",false);
            this.setModel(oTableModelNPF2, "NPF");

            // Подключили данные для построения диаграммы
            var oTableModelVizFrame = new JSONModel();
            oTableModelVizFrame.loadData("./test/VizFrame.json","",false);
            this.setModel(oTableModelVizFrame, "vizFrame");*/

            // Подключаем внешний сервис и сохраняем его в локальную модель
            /*var oMainModel = new JSONModel();
            oMainModel.loadData("https://pfrp1741924689trial.hanatrial.ondemand.com/PFR/pfr.xsjs/person/0000000010","",false);
            oMainModel.attachRequestFailed(function () {
               alert("2222") ;
            });
            this.setModel(oMainModel,"mainModel");*/

            var SNILS = "00000000101";                                                                               // Снилс пользователя, который мы получили из окна авторизации
            var URL = "https://pfrp1741924689trial.hanatrial.ondemand.com/PFR/pfr.xsjs/person/" + SNILS;            // Получаем адресс с данными для конкретного пользователя
            var oComponent = this;

            // загружаем данные с сервера. Так как в sapui5 нет проверки на загрузку json(но это не точно)
            // то используем jQuery.ajax
            $.ajax({
                url:URL,
                dataType: "json",
                success: function () {
                    var oMainModel = new JSONModel();
                    oMainModel.loadData(URL,"",false);
                    oComponent.setModel(oMainModel,"mainModel");


                    // Список НПФов
                    var oListNPFModel = new JSONModel();
                    oListNPFModel.loadData("https://pfrp1741924689trial.hanatrial.ondemand.com/PFR/pfr.xsjs/npfs","",false);
                    oComponent.setModel(oListNPFModel,"npfModel");
                    oComponent.getRouter().initialize();

                },
                error: function () {
                    MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
                }
            });

            UIComponent.prototype.init.apply(this, arguments);

        }
    });
});