/*
	Модуль описывает элементы структуры моделей и константы для приложения
*/
sap.ui.define([
],function(){
    "use strict";

    var oModule = {
        //структура технической модели приложения
        const:{
            ASYNC_UPDATE_TIMEOUT: 30*1000,                       // время, через которое обновляются данные
            BASE_URL: "https://executiona4038b30e.hana.ondemand.com/PFR/pfr.xsjs"

        }
    };

    return oModule;
},true);