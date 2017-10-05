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
                currencyCode: "рублей",                                                     // код валюты
                selectedKey:"",                                                             // выбранная вкладка

                changeTariffTab: {
                    selectedTariff: 0,
                    changeTariffMessage: "",
                    isButtonChangeTariffEnabled: false,
                    isSliderChangeTariffEnabled: false
                },
                changeNpfTab: {
                    selectedNpf: "",
                    isSelectButtonEnabled: true,
                    isSelectedNpfLabelVisible: false,
                    needConformation: true,
                    isNextNpfTableVisible: false,
                    applyButtonText: "Сменить НПФ",
                    isApplyButtonVisible: false,
                    changeNpfMessage: "",
                    changeNpfMessageType: "Error",
                    nextMinTimeForChangeMessage: "",
                    isNextMinTimeForChangeLabelVisible: false
                }
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