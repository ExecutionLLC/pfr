/*
	Модуль описывает элементы структуры моделей и константы для приложения
*/
sap.ui.define([
],function(){
    "use strict";

    var oModule = {
        //структура технической модели приложения
        const:{
            ASYNC_UPDATE_TIMEOUT: 30 * 1000,                                                  // время, через которое обновляются данные
            ASYNC_UPDATE_TIMEOUT_DEFAULT: 60 * 1000,
            BASE_URL: "https://executiona4038b30e.hana.ondemand.com/PFR/pfr.xsjs",
            TIME_NEXT_CHANGE_NPF:120*1000,                                                    // время следующей смены НПФ
            LOGIN_URL: "https://executiona4038b30e.hana.ondemand.com/PFR/simple_login.xsjs"
        }
    };

    return oModule;
},true);