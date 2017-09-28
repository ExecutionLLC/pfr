sap.ui.define([], function () {
    "use strict";
    return {
        formatFooterString:function (text) {

        },
        formatIconColorByStatus : function (sStatus) {
              return sStatus == 'done' ? 'green' : 'red'
        }
    }

},true);