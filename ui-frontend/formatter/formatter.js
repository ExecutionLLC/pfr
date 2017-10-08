sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "personal/account/util/Utils",
    "personal/account/util/Const"
], function (NumberFormat, Utils, Const) {
    "use strict";
    return {

        /**
         * @description объект для форматирования валюты
         */
        oCurrencyFormat: NumberFormat.getCurrencyInstance(),

        formatFooterString: function (text) {

        },
        // изменить название кнопки по щелчку на нее во вкладке "Получить выписку"
        formatButtonName: function (bIsButtonShowApply) {
            return bIsButtonShowApply ? 'Спрятать' : 'Показать'
        },

        formatNpfAddressToName: function (address) {
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("npfModel");

            var item = Utils.getNpfObjectByAddress(address, oModel);

            return item ? item.name : '?';
        },

        formatNpfAddressToReliability: function (address) {
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("npfModel");

            var item = Utils.getNpfObjectByAddress(address, oModel);
            // Возвращаем рейтинг надежности
            return item ? item.ratingOfReliability : '?';
        },

        formatNpfAddressToIncomeRate: function (address) {
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("npfModel");

            var item = Utils.getNpfObjectByAddress(address, oModel);
            // Возвращаем рейтинг доходности
            return item ? item.ratingOfIncomeRate : '?';
        },

        /**
         * @description Форматирование входящего чисела миллисекнд в дату для использования в диаграмме
         *
         */
        formatDate: function (timestamp) {
            var result = Utils.timestampToString(timestamp);
            return result.split('.').slice(1).join('.');
        },

        /**
         * @description Форматирование входящих чисел в дату для использования в таблице
          *
         */
        formatDateForTable: function (timestamp) {
            return Utils.timestampToString(timestamp);
        },

        /**
         * @description Форматирование значения зарплаты
         */
        formatAmountToSalary: function (amount, tariff, comment, currencyCode) {
            if (/.*процент.*/.test(comment)) {
                return "";
            }
            var salary = amount/tariff*100.0;
            return this.formatter.oCurrencyFormat.format(salary, currencyCode);
        },

        /**
         * @description Форматирование рядов в таблице возможных НПФ для вкладки "Смена НПФ"
         * @param name
         */
        formatColumnListItem: function (npfAddress, currentNpfAddress) {
            if (!npfAddress || !currentNpfAddress) {
                return true;
            }

            return npfAddress.toUpperCase() !== currentNpfAddress.toUpperCase();
        },

        formatNpfRating: function (npfAddress) {
            var ratingOfReliability = this.formatter.formatNpfAddressToReliability.call(this,npfAddress);
            var oNpfRating = Utils.conversionNpfRating(ratingOfReliability);
            return oNpfRating.symbol;
        },

        formatTableItemStatus: function (isFinished) {
            return isFinished ? "green" : "#f4d742";
        },

        formatTransactionHashHref: function(transactionHash) {
            return Const.const.BASE_URL + "/transaction/" + transactionHash;
        },

        formatNumberOfConformations: function(isFinished) {
            return isFinished ? 7 : 0;
        }
    }

},true);