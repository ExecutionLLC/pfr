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


        transformDateToString: function (date) {
            if(!date)return "";
            var sYearFrom = date.getFullYear();
            var sMonthFrom = date.getMonth() + 1;						// Месяцы считаются от 0 до 11, добавим +1
            var sDayFrom = date.getDate();

            //Форматируем значение месяца
            if (sMonthFrom < 10) {
                sMonthFrom = "0" + sMonthFrom  							// Если в месяце только одна цифра,добавим в начало "0"
            }

            // Форматиуем значение числа
            if (sDayFrom < 10) {
                sDayFrom = "0" + sDayFrom  								// Если в дне только одна цифра,добавим в начало "0"
            }
            return sDayFrom + "." + sMonthFrom + "." + sYearFrom
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
            var sNewDateFrom = this.transformDateToString(sFrom);
            var sNewDateTo = this.transformDateToString(sTo);
            this.oTechModel.setProperty("/tech/getReportTab/dateFrom",sNewDateFrom);
            this.oTechModel.setProperty("/tech/getReportTab/dateTo",sNewDateTo);
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

            /*Изменение значений выпадающего поля*/
            var aOperationsTableData = this.oTechModel.getProperty("/tech/profileTab/operationsTableData");
            var aAmountIncome = [];
            var aAmountOutgoing = [];
            // Получили массив с начислениями до выбранного периода
            aOperationsTableData.forEach(function (data) {
                if(sFromMS >= data.timestamp){
                    aAmountIncome.push(data.amount)
                }
            });
            // Получили массив с начислениями во время выбранного периода
            aOperationsTableData.forEach(function (data) {
                if(data.timestamp <= sToMS){
                    aAmountOutgoing.push(data.amount)
                }
            });
            function sumOfArrayElement(array) {
                var sum = 0;
                for(var i = 0; i < array.length; i++){
                    sum += array[i];
                }
                return sum;
            }
            var amountSumIncome = sumOfArrayElement(aAmountIncome);
            var amountSumOutgoing = sumOfArrayElement(aAmountOutgoing);
            var amountDifference = amountSumOutgoing - amountSumIncome;
            this.oTechModel.setProperty("/tech/getReportTab/AmountIncome",amountSumIncome);
            this.oTechModel.setProperty("/tech/getReportTab/AmountOutgoing",amountSumOutgoing);
            this.oTechModel.setProperty("/tech/getReportTab/AmountDifference",amountDifference);

        },

        onPrint: function () {
            print();
        }
    });
});