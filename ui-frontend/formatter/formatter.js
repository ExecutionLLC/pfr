sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "personal/account/util/Utils"
], function (NumberFormat, Utils) {
    "use strict";
    return {

        /**
         * @description объект для форматирования валюты
         */
        oCurrencyFormat: NumberFormat.getCurrencyInstance(),

        formatFooterString: function (text) {

        },
        // изменять цвет кружочков в таблице во вкладке "Получить выписку"
        formatIconColorByStatus: function (sStatus) {
              return sStatus === 'done' ? 'green' : 'red'
        },
        // изменить название кнопки по щелчку на нее во вкладке "Получить выписку"
        formatButtonName: function (bIsButtonShowApply) {
            return bIsButtonShowApply === true ? 'Спрятать' : 'Показать'
        },

        /**
         * @description Возвращает имя НПФ при наличии его адресса
         * 
         */
        formatNPFadressToName: function (adress) {
            var oComponent = this.getOwnerComponent();
            var oListNPFModel = oComponent.getModel("npfModel");                        // Получили набор данных пользователя
            var NPF = adress;                                                           // Текущий НПФ
            var aNpfs = oListNPFModel.getData();                                            // Получили массив НПФ
            var NPFDesc = aNpfs.find(function (npfs) {                                  // В каждом эл массива ищем объект в котором
                return npfs.address === NPF;                                            // адресс совпадает с нашим текущим
            });

            return NPFDesc.name                                                         // Возвращаем название НПФ
        },

        /**
         * @description Возвращает рейтинг надежности НПФ при наличии его адресса
         *
         */
        formatNpfAddressToReliability: function (address) {
            var oComponent = this.getOwnerComponent();
            var oModel = oComponent.getModel("npfModel");

            var item = Utils.getNpfObjectByAddress(address, oModel);
            // Возвращаем рейтинг доходности
            return item ? item.ratingOfReliability : '?';
        },

        /**
         * @description Возвращает рейтинг доходности НПФ при наличии его адресса
         *
         */
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
         * @description Форматирование видимости слайдера в зависимотси от pendedTariffChanges
         */
        formatSliderEnable: function (pendedTariffChanges) {
            return pendedTariffChanges.length === 0;
        },

        /**
         * @description Форматирование значения зарплаты
         */
        formatAmountToSalary: function (amount, tariff, currencyCode) {
            var salary = amount/tariff*100.0;
            return this.formatter.oCurrencyFormat.format(salary,currencyCode);
        },

        /**
         * @description Форматирование рядов в таблице возможных НПФ для вкладки "Смена НПФ"
         * @param name
         */
        formatColumnListItem: function (npfAddress, currentNpfAddress) {
            return npfAddress.toUpperCase() !== currentNpfAddress.toUpperCase();
        }
    }

},true);