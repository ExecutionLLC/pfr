/*
	Модуль описывает элементы структуры моделей и константы для приложения
*/
sap.ui.define([
],function(){
    "use strict";

    var oModule = {
        //структура технической модели приложения
        const:{
            // время, через которое обновляются данные
            ASYNC_UPDATE_TIMEOUT: 30 * 1000,
            ASYNC_UPDATE_TIMEOUT_DEFAULT: 60 * 1000,
            BASE_URL: "https://executiona4038b30e.hana.ondemand.com/PFR/pfr.xsjs",
            // время следующей смены НПФ
            TIME_NEXT_CHANGE_NPF:120*1000,
            LOGIN_URL: "https://executiona4038b30e.hana.ondemand.com/PFR/simple_login.xsjs",
            DEFAULT_NUMBER_OF_CONFORMATIONS: 7,
            // значения ключей селекта диаграммы
            SELECTED_LAST_YEAR : "last-year",
            SELECTED_ALL_TIME : "all-time",
            //цвета состояния выполнения запроса
            REQUEST_DONE: "green",
            REQUEST_PENDING: "#f4d742"
        }
    };

    return oModule;
},true);