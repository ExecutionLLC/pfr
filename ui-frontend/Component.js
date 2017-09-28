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
            var oTechModel = new JSONModel(Model.modelStructure.tech);
            this.setModel(oTechModel, "techModel");

            // Подключили данные для таблицы выписки
            var oTableModel = new JSONModel();
            oTableModel.loadData("./test/TableData.json","",false);
            this.setModel(oTableModel, "tableModel");

            // Подключили данные для таблицы смены тарифа
            var oTableModelTarif = new JSONModel();
            oTableModelTarif.loadData("./test/TableDataChangeTarif.json","",false);
            this.setModel(oTableModelTarif, "tableModelChangeTarif");

            // Подключили таблицу для смены НПФ
            var oTableModelNPF = new JSONModel();
            oTableModelNPF.loadData("./test/TableDataNPF.json","",false);
            this.setModel(oTableModelNPF, "tableModelNPF");

            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        }
    });
});