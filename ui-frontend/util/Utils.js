sap.ui.define([], function() {
    "use strict";

    var oModule = {
        _addLeadingZeroIfNeedIt: function (value) {
            if (value.length < 2) {
                return "0" + value;
            }

            return value;
        },
        dateObjToDateString: function(date) {
            var day = String(date.getDate());
            var month = String(date.getMonth() + 1);
            var year = date.getFullYear();

            return oModule._addLeadingZeroIfNeedIt(day) + "." + oModule._addLeadingZeroIfNeedIt(month) + "." + year;
        },
        dateObjToTimeString: function(date) {
            var hours = String(date.getHours());
            var minutes = String(date.getMinutes());

            return oModule._addLeadingZeroIfNeedIt(hours) + ":" + oModule._addLeadingZeroIfNeedIt(minutes);
        },
        timestampToString: function(timestamp, addTime) {
            var date = new Date(timestamp);

            var result = oModule.dateObjToDateString(date);
            if (addTime) {
                result = result + ' ' + oModule.dateObjToTimeString(date);
            }

            return result;
        },
        getNpfObjectByAddress: function(address, model) {
            if (!address) {
                return null;
            }

            var modelData = model.getData();
            return modelData.find(function(item) {
                return item.address.toUpperCase() === address.toUpperCase();
            });
        },

        conversionNpfRating: function (int) {
            var oRating = null;
            switch (int){
                case 0:
                    oRating = {
                        symbol: "D",
                        descrition: "В состоянии дефолта"
                    };
                    break;
                case 1:
                    oRating = {
                        symbol: "C",
                        descrition: "Близки к дефолту"
                    };
                    break;
                case 2:
                    oRating = {
                        symbol: "CC",
                        descrition: "Близки к дефолту"
                    };
                    break;
                case 3:
                    oRating = {
                        symbol: "CCC-",
                        descrition: "Близки к дефолту"
                    };
                    break;
                case 4:
                    oRating = {
                        symbol: "CCC",
                        descrition: "Крайне высокий кредитный риск"
                    };
                    break;
                case 5:
                    oRating = {
                        symbol: "CCC+",
                        descrition: "Очень высокий кредитный риск"
                    };
                    break;
                case 6:
                    oRating = {
                        symbol: "B-",
                        descrition: "Рискованные обязательства в высокой степени спекулятивные"
                    };
                    break;
                case 7:
                    oRating = {
                        symbol: "B",
                        descrition: "Рискованные обязательства в высокой степени спекулятивные"
                    };
                    break;
                case 8:
                    oRating = {
                        symbol: "B+",
                        descrition: "Рискованные обязательства в высокой степени спекулятивные"
                    };
                    break;
                case 9:
                    oRating = {
                        symbol: "BB-",
                        descrition: "Рискованные обязательства с чертами спекулятивных"
                    };
                    break;
                case 10:
                    oRating = {
                        symbol: "BB",
                        descrition: "Рискованные обязательства с чертами спекулятивных"
                    };
                    break;
                case 11:
                    oRating = {
                        symbol: "BB+",
                        descrition: "Рискованные обязательства с чертами спекулятивных"
                    };
                    break;
                case 12:
                    oRating = {
                        symbol: "BBB-",
                        descrition: "Надежность ниже среднего"
                    };
                    break;
                case 13:
                    oRating = {
                        symbol: "BBB",
                        descrition: "Надежность ниже среднего"
                    };
                    break;
                case 14:
                    oRating = {
                        symbol: "BBB+",
                        descrition: "Надежность ниже среднего"
                    };
                    break;
                case 15:
                    oRating = {
                        symbol: "A-",
                        descrition: "Надежность выше среднего"
                    };
                    break;
                case 16:
                    oRating = {
                        symbol: "A",
                        descrition: "Надежность выше среднего"
                    };
                    break;
                case 17:
                    oRating = {
                        symbol: "A+",
                        descrition: "Надежность выше среднего"
                    };
                    break;
                case 18:
                    oRating = {
                        symbol: "AA-",
                        descrition: "Высокая надежность"
                    };
                    break;
                case 19:
                    oRating = {
                        symbol: "AA",
                        descrition: "Высокая надежность"
                    };
                    break;
                case 20:
                    oRating = {
                        symbol: "AA+",
                        descrition: "Высокая надежность"
                    };
                    break;
                case 21:
                    oRating = {
                        symbol: "AAA",
                        descrition: "Наивысша надежность"
                    };
                    break;
            }
            return oRating;
        }
    };

    return oModule;
}, true);