/*
	Модуль описывает элементы структуры моделей и константы для приложения
*/
sap.ui.define([
],function(){

    "use strict";

    var oModule={
        //структуры локальных моделей
        modelStructure:{
            //техническая модель приложения
            tech:{
                isButtonShowApply:false,				// Индикатор который показывает нажата ли кнопка показать во вкладке "Получить выписку"
                currentValueSlider: null,               // Значение слайдера
                isButtonShowNPFApply:false,             // Индикатор который показывает нажата ли кнопка показать во вкладке "Сменить НПФ"
                isCustomListSelected:false
            }
        }

    };

    return oModule;

},true);