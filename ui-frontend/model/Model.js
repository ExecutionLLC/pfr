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
                isCustomListSelected:false,                                                 // Индикатор состояния таблицы выбора НПФ во вкладке "Сменить НПФ"
                currencyCode: "рублей",                                                     // код валюты
                selectedKey:"",                                                             // выбранная вкладка
                tariff: null,                                                               // значение тарифа для конкретного пользователя (вставляется из бэка при загрузке страницы)
                isButtonChangeTariffEnable: false,                                          // Доступность кнопки "Сменить тариф" во вкладке "Сменить тариф"
                isSliderChangeTariffEnable: false                                           // Доступность слайдера на вкладке "Сменить тариф"
            },
            // модель для хранения значений для изменений НПФ (последняя вкладка)
            changeNPF:{
                currentNPF:"Флокс",
                newNPF:"",
                buttonText:"Сменить НПФ",
                warningText:"Вы уверены? Отменить операцию будет невозможно!",
                isWarningTextVisible:false,
                state:"Error",
                buttonPressCount:0,                                                          // Счетчик нажатия кнопки "Сменить НПФ"
                dateChangeNpf:"",
                NewTimestamp: null
            },
            // Настройки диаграммы
            diagrammProperties:{
                // Ось Х
                valueAxis:{
                    title:{
                        visible:false                                                       // Видимость заголовка оси Х
                    },
                    axisLine:{
                        visible:false                                                       // Видимость левой полосы
                    }
                },
                // Ось Y
                categoryAxis:{
                    title:{                                                                 // Видимость заголовка оси Y
                        visible:false
                    },
                    axisTick:{
                        visible:false                                                       // Видимость рисок
                    }
                },
                title: {                                                                    // Видимость основного заголовка диаграммы
                    visible: false
                }
            }
        }
    };

    return oModule;

},true);