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
        }
    }

},true);