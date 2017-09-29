sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "personal/account/model/Model"
], function (UIComponent, JSONModel, Model) {
    "use strict";
    return UIComponent.extend("personal.account.Component", {
        metadata : {
            manifest: "json"
        },
        init : function () {
            // call the init function of the parent
            var oTechModel = new JSONModel(Model.modelStructure);
            this.setModel(oTechModel, "techModel");


            // Подключили данные для таблицы выписки
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
            this.setModel(oTableModelVizFrame, "vizFrame");

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});