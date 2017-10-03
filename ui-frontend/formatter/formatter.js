sap.ui.define([], function () {
    "use strict";
    return {
        formatFooterString:function (text) {

        },
        // изменять цвет кружочков в таблице во вкладке "Получить выписку"
        formatIconColorByStatus: function (sStatus) {
              return sStatus == 'done' ? 'green' : 'red'
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
            var nMonth = oDate.getMonth() +1;
            var nYear = oDate.getFullYear();

            nMonth < 10 ? nMonth = "0" + nMonth : nMonth;

            return nMonth + "." + nYear
        },

        /**
         * @description Форматирование входящих чисел в дату для использования в таблице
          *
         */
        formateDateforTable: function (timestamp) {
            var oDate = new Date(timestamp);
            var nDay = oDate.getDay()+1;
            var nMonth = oDate.getMonth()+1;
            var nYear = oDate.getFullYear();

            nDay < 10 ? nDay = "0" + nDay : nDay;
            nMonth < 10 ? nMonth = "0" + nMonth : nMonth;

            return nDay + "." + nMonth + "." + nYear
        }
    }

},true);