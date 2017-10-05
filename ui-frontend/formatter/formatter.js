sap.ui.define(["sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
    "use strict";
    return {

        /**
         * @description объект для форматирования валюты
         */
        oCurrencyFormat: NumberFormat.getCurrencyInstance(),


        /**
         * @description Внутренняя функция для добавления "0" вначало числа которое < 10
         * @param value
         * @return {string}
         */
        _addLeadingZeroIfNeedIt: function(value) {
            if (value < 10) {
                return "0" + value
            }
                return value;
        },


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
        formatNPFadressToReliability: function (adress) {
            var oComponent = this.getOwnerComponent();
            var oListNPFModel = oComponent.getModel("npfModel");                        // Получили набор данных пользователя
            var NPF = adress;                                                           // Текущий НПФ
            var aNpfs = oListNPFModel.getData();                                        // Получили массив НПФ
            var NPFDesc = aNpfs.find(function (npfs) {                                  // В каждом эл массива ищем объект в котором
                return npfs.address === NPF;                                            // адресс совпадает с нашим текущим
            });
            return   NPFDesc.ratingOfReliability                                                         // Возвращаем рейтинг надежности
        },

        /**
         * @description Возвращает рейтинг доходности НПФ при наличии его адресса
         *
         */
        formatNPFadressToIncomeRate: function (adress) {
            var oComponent = this.getOwnerComponent();
            var oListNPFModel = oComponent.getModel("npfModel");                        // Получили набор данных пользователя
            var NPF = adress;                                                           // Текущий НПФ
            var aNpfs = oListNPFModel.getData();                                        // Получили массив НПФ
            var NPFDesc = aNpfs.find(function (npfs) {                                  // В каждом эл массива ищем объект в котором
                return npfs.address === NPF;                                            // адресс совпадает с нашим текущим
            });

            return NPFDesc.ratingOfIncomeRate;                                          // Возвращаем рейтинг доходности
        },

        /**
         * @description Форматирование входящего чисела миллисекнд в дату для использования в диаграмме
         *
         */
        formatDate: function (timestamp) {
                var oDate = new Date(timestamp);
                var nMonth = this.formatter._addLeadingZeroIfNeedIt(oDate.getMonth() + 1);
                var nYear = oDate.getFullYear();

                return nMonth + "." + nYear
        },

        /**
         * @description Форматирование входящих чисел в дату для использования в таблице
          *
         */
        formateDateforTable: function (timestamp) {
                var oDate = new Date(timestamp);
                var nDay = this.formatter._addLeadingZeroIfNeedIt(oDate.getDate());
                var nMonth = this.formatter._addLeadingZeroIfNeedIt(oDate.getMonth() + 1);
                var nYear = oDate.getFullYear();

                return nDay + "." + nMonth + "." + nYear
        },

        /**
         * @description Форматирование видимости слайдера в зависимотси от pendedTariffChanges
         */
        formatSliderEnable: function (pendedTariffChanges) {
            return !pendedTariffChanges.length > 0;
        },

        /**
         * @description Форматирование значения зарплаты
         */
        formateAmountToSalary: function (amount, tariff, currencyCode) {
            var sallary = amount/tariff*100.0;
            var formatSallary = this.formatter.oCurrencyFormat.format(sallary,currencyCode);
            return formatSallary
        },

        /**
         * @description Форматирование рядов в таблице возможных НПФ для вкладки "Смена НПФ"
         * @param name
         */
        formatColumnListItem: function (adressNpf, currentNpfAdress) {
            var adressNpfUpper = adressNpf.toUpperCase();
            var currentNpfAdressUpper = currentNpfAdress.toUpperCase();

            return !(currentNpfAdressUpper === adressNpfUpper)
        },

        /**
         * @description Форматирование видимости кнопки "Выбрать НПФ" в зависимости от pendedNpfChanges
         */
        formatButtonNpfEnable: function (pendedNpfChanges, newTimestamp) {
            function func() {
                return true
            }
            //var nNow = new Date().getMilliseconds();
            if(pendedNpfChanges.length !== 0){
                return false                           // Если в обработке есть что то кнопка не доступна
            }else if(pendedNpfChanges.length === 0 && new Date() > newTimestamp){
                return true
            }else if(pendedNpfChanges.length === 0 && new Date() < newTimestamp){
                var time = newTimestamp - new Date();
                setTimeout(func,time)
            }
        }
    }

},true);