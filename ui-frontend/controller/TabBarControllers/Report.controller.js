sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Report", {
        formatter: formatter,


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
            var sFromMS = +new Date(sFrom);											    // Преобразованная строка даты периода "с"
            var sToMS = +new Date(sTo);											    // Преобразованная строка даты периода "по"
            var aFilters = [];
            if (sFrom && sTo) {
                aFilters.push(new Filter({
                            path    : "timestamp",
                            operator: sap.ui.model.FilterOperator.GE,
                            value1  : sFromMS
                        })
                );
                aFilters.push(new Filter({
                            path    : "timestamp",
                            operator: sap.ui.model.FilterOperator.LE,
                            value1  : sToMS
                        })
                );
                this._oFilterSet.dateFilter = new Filter({			        // Запишем фильтр в массив фильтров
                    filters: aFilters,
                    and    : true
                });
            }else {
                this._oFilterSet.dateFilter = null
            }

            // применение фильтра к таблице
            //todo узнать когда нужно применять фильтр, по нажатию на кнопку или сразу
            var oTable = this.getView().byId("table--report");
            var oBinding = oTable.getBinding("items");

            oBinding.filter(this._oFilterSet.dateFilter);



        }
    });
});