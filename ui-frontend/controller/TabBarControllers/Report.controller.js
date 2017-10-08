sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Report", {
        formatter: formatter,

        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");

            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/", this.oMainModel.getContext("/")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));
        },

        onMainModelChanges: function() {
            var operationsHistory = this.oMainModel.getProperty("/operationsHistory");
            var pendedOperationsChanges = this.oMainModel.getProperty("/pendedOperations");

            var currentTariff = this.oMainModel.getProperty("/tariff");
            var currentNpf = this.oMainModel.getProperty("/npf");

            var operationsTableData = pendedOperationsChanges.map(function (value) {
                return {
                    npf: currentNpf,
                    tariff: currentTariff,
                    amount: value.amount,
                    contractor: value.contractor,
                    comment: value.comment,
                    timestamp: value.timestamp,
                    transactionHash: value.transactionHash,
                    isFinished: false
                };
            });
            operationsTableData = operationsTableData.concat(operationsHistory.map(function (value) {
                return {
                    npf: value.npf,
                    tariff: value.tariff,
                    amount: value.amount,
                    contractor: value.contractor,
                    comment: value.comment,
                    timestamp: value.timestamp,
                    transactionHash: value.transactionHash,
                    isFinished: true
                }
            }));

            this.oTechModel.setProperty("/tech/profileTab/operationsTableData", operationsTableData);
        },

        // Сохраним фильтры
        _oFilterSet: {
            dateFilter: null
        },

        /**
         * @description Составление фильтра по датам
         */
        onDateRangeChange: function (oEvent) {
            var sFrom = oEvent.getParameter("from");
            var sTo = oEvent.getParameter("to");
            // Преобразованная строка даты периода "с"
            var sFromMS = +new Date(sFrom);
            // Преобразованная строка даты периода "по"
            var sToMS = +new Date(sTo);
            var aFilters = [];
            if (sFrom && sTo) {
                aFilters.push(new Filter({
                    path: "timestamp",
                    operator: sap.ui.model.FilterOperator.GE,
                    value1: sFromMS
                }));
                aFilters.push(new Filter({
                    path: "timestamp",
                    operator: sap.ui.model.FilterOperator.LE,
                    value1: sToMS
                }));
                // Запишем фильтр в массив фильтров
                this._oFilterSet.dateFilter = new Filter({
                    filters: aFilters,
                    and: true
                });
            } else {
                this._oFilterSet.dateFilter = null
            }

            // применение фильтра к таблице
            //todo узнать когда нужно применять фильтр, по нажатию на кнопку или сразу
            var oTable = this.getView().byId("table--report");
            var oBinding = oTable.getBinding("items");

            oBinding.filter(this._oFilterSet.dateFilter);
        },

        onPrint: function () {
            print();
        }
    });
});