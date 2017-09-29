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
                isButtonShowApply:false,				                                    // Индикатор который показывает нажата ли кнопка показать во вкладке "Получить выписку"
                currentValueSlider: null,                                                   // Значение слайдера
                isButtonShowNPFApply:false,                                                 // Индикатор который показывает нажата ли кнопка "Выбрать НПФ" во вкладке "Сменить НПФ"
                isCustomListSelected:false                                                  // Индикатор состояния таблицы выбора НПФ во вкладке "Сменить НПФ"
            },
            // модель для хранения значений для изменений НПФ (последняя вкладка)
            changeNPF:{
                currentNPF:"Флокс",
                newNPF:"",
                buttonText:"Сменить НПФ",
                warningText:"Вы уверены? Отменить операцию будет невозможно!",
                isWarningTextVisible:false,
                state:"Error",
                buttonPressCount:0                                                          // Счетчик нажатия кнопки "Сменить НПФ"
            }
        }

    };

    return oModule;

},true);