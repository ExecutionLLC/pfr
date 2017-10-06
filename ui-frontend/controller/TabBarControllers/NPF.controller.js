sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const",
    "personal/account/util/Utils",
    "sap/ui/model/json/JSONModel"
], function (Controller, formatter, Const, Utils, JSONModel) {
    "use strict";

    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        formatter: formatter,

        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");
            this.enableSelectButtonTimerId = null;

            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/", this.oMainModel.getContext("/")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));

            /*для таблицы*/
            var oController = this;
            var oModel = new JSONModel();
            oModel.loadData("./test/TableDataNPF.json");
            oModel.attachRequestCompleted(function(){
                oController.bindTable(oModel);
            });
        },

        bindTable : function(oModel) {
            //this.createOnlyColumnsTable(oModel);
            this.createOnlyRowsTable(oModel);
        },


    /*createOnlyColumnsTable:function(oModel){
        var oColumnsTable = this.getView().byId("ColumnsTable");
        oColumnsTable.setShowNoData(false);
        oColumnsTable.setModel(oModel, "tableModel");

        oColumnsTable.bindAggregation("columns", {
            path:"tableModel>/columns",
            factory: function(sId, oCtx){
                var oCol=new sap.m.Column({
                    width:'{tableModel>width}',
                    header : new sap.m.Label({ text : '{tableModel>colName}'})
                });
                return oCol;
            }
        });
    },*/


    createOnlyRowsTable:function(oModel){
        var oTable = this.getView().byId("RowsTable");
        oTable.setModel(oModel, "tableModel");
        var columnData = {
            "columns":[{
                columnName: "firstName",
                width: "10px"
            }, {
                columnName: "lastName",
                width: "10px"
            }, {
                columnName: "department",
                width: "10px"
            }]
        };


        var oColumnModel = new JSONModel(columnData);


        oTable.setModel(oColumnModel, "columnData");

        oTable.bindAggregation("columns", {
            path:"columnData>/columns",
            factory: function(sId, oCtx){
                var oCol = new sap.m.Column({
                    width:'{columnData>width}'
                });
                return oCol;
            }
        });

        oTable.bindAggregation("items",{
            path:"tableModel>/Rows",
            factory : this.rowFactory
        });
    },


    rowFactory : function(sId, oCtx){

        var oToolbar = new sap.m.Toolbar({
            width : "100%",
            content : [
                new sap.m.Text({
                    text : "ewrerr",
                    width : "16%"
                }),
                new sap.m.Text({
                    text : "ewrerr",
                    width : "16%"
                }),
                new sap.m.Text({
                    text : "ewrerr",
                    width : "16%"
                })]
        });

        var aContent = [new sap.m.Text({
            text : "ID Транзакции",
            width : "30%"
        }),
            new sap.m.Text({
                text : "Отправитель",
                width : "30%"
            }),
            new sap.m.Text({
                text : "Количество подтверждений",
                width : "30%"
            })];
        var oPanel = new sap.m.Panel({
            expandable :true,
            expanded : false,
            width : "auto",
            headerToolbar : oToolbar,
            content : aContent
        });


        var oItem = new sap.m.CustomListItem({
            content : oPanel
        });

        return oItem;
    },
/*----------------------------------------------------------------------------------------------------------------------*/

        // FIXME
        _returnNpfAdress: function (npfName) {
            // Получили набор данных пользователя
            var oListNPFModel = this.oComponent.getModel("npfModel");
            // Текущий НПФ
            var NPF = npfName;
            // Получили массив НПФ
            var aNpfs = oListNPFModel.getData();
            // В каждом эл массива ищем объект в котором
            var npfDesc = aNpfs.find(function (npfs) {
                // имя совпадает с нашим текущим
                return npfs.name === NPF;
            });

            return npfDesc.address;
        },

        enableSelectButton: function(enable, nextMinTimeForChanges) {
            if (nextMinTimeForChanges) {
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextMinTimeForChangeLabelVisible", true);
                var message = Utils.timestampToString(nextMinTimeForChanges, true);
                this.oTechModel.setProperty("/tech/changeNpfTab/nextMinTimeForChangeMessage", message);
                this.oTechModel.setProperty("/tech/changeNpfTab/isSelectButtonEnabled", false);
            } else {
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextMinTimeForChangeLabelVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/nextMinTimeForChangeMessage", "");
                this.oTechModel.setProperty("/tech/changeNpfTab/isSelectButtonEnabled", true);
            }
        },

        onMainModelChanges: function() {
            if(!this.oMainModel.getProperty("/metadata/snils")) {
                // user is logged out
                return;
            }

            var npfHistory = this.oMainModel.getProperty("/npfHistory");
            var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");

            if (pendedNpfChanges.length !== 0) {
                this.oTechModel.setProperty("/tech/changeNpfTab/selectedNpf", "");
                this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", true);
                this.oTechModel.setProperty("/tech/changeNpfTab/isApplyButtonVisible", false);
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "Заявка на рассмотрении");
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessageState", "Warning");
            } else {
                var changeNpfMessage = this.oTechModel.getProperty("/tech/changeNpfTab/changeNpfMessage");
                // FIXME
                if (changeNpfMessage === "Заявка на рассмотрении") {
                    this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "");
                }
            }

            var nextMinTimeForChanges = null;
            if (pendedNpfChanges.length !== 0) {
                var lastItem = pendedNpfChanges[pendedNpfChanges.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.const.TIME_NEXT_CHANGE_NPF;
            } else if (npfHistory.length !== 0) {
                var lastItem = npfHistory[npfHistory.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.const.TIME_NEXT_CHANGE_NPF;
            }

            var currentTime = (new Date()).valueOf();
            if (nextMinTimeForChanges && currentTime < nextMinTimeForChanges) {
                if (this.enableSelectButtonTimerId) {
                    clearTimeout(this.enableSelectButtonTimerId);
                }

                this.enableSelectButton(false, nextMinTimeForChanges);

                this.enableSelectButtonTimerId = setTimeout(function () {
                    this.enableSelectButton(true);
                    this.enableSelectButtonTimerId = null;
                }.bind(this), nextMinTimeForChanges - currentTime);
            } else {
                this.enableSelectButton(true);
            }
        },

        onSelectButton: function (oEvent) {
            var isNextNpfTableVisible = !this.oTechModel.getProperty("/tech/changeNpfTab/isNextNpfTableVisible");
            this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", isNextNpfTableVisible);
        },

        onSelectNpfTableItem: function (oEvent) {
            var oItem = oEvent.getSource();
            var aCells = oItem.getAggregation("cells");
            var selectedNpfName = aCells[0].getProperty("text");

            this.oTechModel.setProperty("/tech/changeNpfTab/selectedNpf", selectedNpfName);
            this.oTechModel.setProperty("/tech/changeNpfTab/isNextNpfTableVisible", false);
            this.oTechModel.setProperty("/tech/changeNpfTab/applyButtonText", "Сменить НПФ");
            this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", true);
            this.oTechModel.setProperty("/tech/changeNpfTab/isApplyButtonVisible", true);
            this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "");
        },

        onApplyButton: function () {
            var needConformation = this.oTechModel.getProperty("/tech/changeNpfTab/needConformation");
            if (needConformation) {
                this.oTechModel.setProperty("/tech/changeNpfTab/applyButtonText", "Все равно сменить");
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessage", "Вы уверены? Отменить операцию будет невозможно!");
                this.oTechModel.setProperty("/tech/changeNpfTab/changeNpfMessageType", "Error");
                this.oTechModel.setProperty("/tech/changeNpfTab/needConformation", false);
            } else {
                var snils = this.oMainModel.getProperty("/metadata/snils");
                var baseUrl = Const.const.BASE_URL;
                var changeNpfURL = baseUrl + "/person/" + snils + "/npf";

                var selectedNpfName = this.oTechModel.getProperty("/tech/changeNpfTab/selectedNpf");
                var selectedNpfAddress = this._returnNpfAdress(selectedNpfName);

                $.ajax({
                    url: changeNpfURL,
                    dataType: "json",
                    type: "PUT",
                    data: JSON.stringify({"npf": selectedNpfAddress}),
                    jsonp: false
                });

                var now = (new Date()).valueOf();
                var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");
                // состояние кнопок/лейблов/... следует состоянию модели, все изменения состояния GUI произойдут в onMainModelChanges
                this.oMainModel.setProperty("/pendedNpfChanges", pendedNpfChanges.concat([{
                    npf: selectedNpfAddress,
                    timestamp: now
                }]));
            }
        }
    });
});