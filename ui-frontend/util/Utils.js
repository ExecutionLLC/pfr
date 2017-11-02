sap.ui.define([
    "sap/m/MessageBox",
    "personal/account/util/Const"
], function(MessageBox, Const) {
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
                result = result + " " + oModule.dateObjToTimeString(date);
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
            var adressUpperCase = address.toUpperCase();
            return modelData.find(function(item) {
                return item.address.toUpperCase() === adressUpperCase;
            });
        },

        conversionNpfRating: function (int) {
            var defaultRating = {
                symbol: "?",
                descrition: "Неизвестен"
            };
            var ratingForInt = {
                0: {
                    symbol    : "D",
                    descrition: "В состоянии дефолта"
                },
                1: {
                    symbol    : "C",
                    descrition: "Близки к дефолту"
                },
                2: {
                    symbol    : "CC",
                    descrition: "Близки к дефолту"
                },
                3: {
                    symbol    : "CCC-",
                    descrition: "Близки к дефолту"
                },
                4: {
                    symbol    : "CCC",
                    descrition: "Крайне высокий кредитный риск"
                },
                5: {
                    symbol    : "CCC+",
                    descrition: "Очень высокий кредитный риск"
                },
                6: {
                    symbol    : "B-",
                    descrition: "Рискованные обязательства в высокой степени спекулятивные"
                },
                7: {
                    symbol    : "B",
                    descrition: "Рискованные обязательства в высокой степени спекулятивные"
                },
                8: {
                    symbol    : "B+",
                    descrition: "Рискованные обязательства в высокой степени спекулятивные"
                },
                9: {
                    symbol    : "BB-",
                    descrition: "Рискованные обязательства с чертами спекулятивных"
                },
                10: {
                    symbol    : "BB",
                    descrition: "Рискованные обязательства с чертами спекулятивных"
                },
                11: {
                    symbol    : "BB+",
                    descrition: "Рискованные обязательства с чертами спекулятивных"
                },
                12: {
                    symbol    : "BBB-",
                    descrition: "Надежность ниже среднего"
                },
                13: {
                    symbol    : "BBB",
                    descrition: "Надежность ниже среднего"
                },
                14: {
                    symbol    : "BBB+",
                    descrition: "Надежность ниже среднего"
                },
                15: {
                    symbol    : "A-",
                    descrition: "Надежность выше среднего"
                },
                16: {
                    symbol    : "A",
                    descrition: "Надежность выше среднего"
                },
                17: {
                    symbol    : "A+",
                    descrition: "Надежность выше среднего"
                },
                18: {
                    symbol    : "AA-",
                    descrition: "Высокая надежность"
                },
                19: {
                    symbol    : "AA",
                    descrition: "Высокая надежность"
                },
                20: {
                    symbol    : "AA+",
                    descrition: "Высокая надежность",
                    imageSrc  : "./image/AAplus.jpg"
                },
                21: {
                    symbol    : "AAA",
                    descrition: "Наивысшая надежность",
                    imageSrc  : "./image/AAA.jpg"
                },
                22: {
                    symbol    : "AAA+",
                    descrition: "Наивысшая надежность",
                    imageSrc  : "./image/AAAplus.jpg"
                }
            };

            return ratingForInt[int] || defaultRating;
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
        showMessageBoxTransactionInfo: function (transactionHash, langModel) {
            $.ajax({
                url: oModule.getTransactionInfoUrl(transactionHash),
                dataType: "json"
            }).done(function (hashInfo) {
                if (hashInfo && hashInfo.input) {
                    delete hashInfo.input;
                }
                var transactionInfo = JSON.stringify(hashInfo, null, 4)
                    .replace(/[" {},]/g, "")
                    .replace(/[:]/g, " = ");

                MessageBox.information(transactionInfo);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Cannot get transaction info: textStatus = ", textStatus, "error = ", errorThrown);
                var sErrorText = langModel.getResourceBundle().getText("msg.box.error");
                MessageBox.error(sErrorText);
            });
        },
        onNavigateToTab: function (router, tabName) {
            router.navTo("menuPage", {
                query: {
                    tab: tabName
                }
            }, true);
        },
        getLoginUrl: function () {
            var url = Const.LOGIN_URL;
            return oModule.addRegionParameter(url);
        },
        getPersonInfoUrl: function (snils) {
            var url = Const.BASE_URL + "/person/" + snils;
            return oModule.addRegionParameter(url);
        },
        getNpfsUrl: function () {
            var url = Const.BASE_URL + "/npfs";
            return oModule.addRegionParameter(url);
        },
        getChangeNpfUrl: function (snils) {
            var url = Const.BASE_URL + "/person/" + snils + "/npf";
            return oModule.addRegionParameter(url);
        },
        getChangeTariffUrl: function (snils) {
            var url = Const.BASE_URL + "/person/" + snils + "/tariff";
            return oModule.addRegionParameter(url);
        },
        getTransactionInfoUrl: function(transactionHash) {
            var url = Const.BASE_URL + "/transaction/" + transactionHash;
            return oModule.addRegionParameter(url);
        },
        addRegionParameter: function (url) {
            var region = Const.LANG;
            if (!region) {
                region = sap.ui.getCore().getConfiguration().getLanguage();
            }
            if (region.length > 2) {
                region = region.slice(0, 2);
            }

            return url + "?region=" + region.toLowerCase();
        }
    };

    return oModule;
}, true);