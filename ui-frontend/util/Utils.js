sap.ui.define([
    "sap/m/MessageBox"
], function(MessageBox) {
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
            if (!address || !model) {
                return null;
            }

            var modelData = model.getData();
            if (!modelData || !modelData.find) {
                return null;
            }

            return modelData.find(function(item) {
                return item.address.toUpperCase() === address.toUpperCase();
            });
        },

        conversionNpfRating: function (int) {
            var oRating = {
                symbol: "?",
                descrition: "Неизвестен"
            };
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
                        descrition: "Высокая надежность",
                        imageSrc: "./image/AAplus.jpg"
                    };
                    break;
                case 21:
                    oRating = {
                        symbol: "AAA",
                        descrition: "Наивысша надежность",
                        imageSrc: "./image/AAA.jpg"
                    };
                    break;
                case 22:
                    oRating = {
                        symbol: "AAA+",
                        descrition: "Наивысша надежность",
                        imageSrc: "./image/AAAplus.jpg"
                    };
                    break;
            }
            return oRating;
        },
        conversionNpfIncomeRateToImage: function (incomeRate) {
            var sImageSrc;
            switch (incomeRate){
                case 7:
                    sImageSrc = "./image/7.jpg";
                    break;
                case 8:
                    sImageSrc = "./image/8.jpg";
                    break;
                case 9:
                    sImageSrc = "./image/9.jpg";
                    break;
            }
            return sImageSrc;
        },
        showMessageBoxHashInfo: function (transactionHashURL) {
            $.ajax({
                url: transactionHashURL,
                dataType: "json"
            }).done(function (hashInfo) {
                var JsonStr = JSON.stringify(hashInfo, null, 4);
                var JsonSlice = JsonStr.slice(1,-1);
                var transactionInfo = JsonSlice.replace(/[" ]/g, '');

                MessageBox.information(transactionInfo);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error('Cannot update model data: textStatus = ', textStatus, 'error = ', errorThrown);
                MessageBox.error("Ошибка при загрузке данных. Повторите попытку позже");
            });
        }
    };

    return oModule;
}, true);