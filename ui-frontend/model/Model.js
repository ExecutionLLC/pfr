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
                //currencyCode: "RUB",
                selectedKey: "",
                profileTab: {
                    diagramData: []
                },
                getReportTab: {
                    isShowHideButtonPressed: false,
                    isShowHideButtonEnabled: false,
                    dateFrom: "?",
                    dateTo: "?",
                    AmountIncome: 0,
                    AmountOutgoing: 0,
                    AmountDifference: 0,
                    operationsTableData: []
                },
                changeTariffTab: {
                    selectedTariff: 6,
                    changeTariffMessage: "",
                    isButtonChangeTariffEnabled: false,
                    isSliderChangeTariffEnabled: false,
                    tariffTableData: []
                },
                changeNpfTab: {
                    selectedNpf: "",
                    isSelectButtonEnabled: true,
                    isSelectedNpfLabelVisible: false,
                    needConformation: true,
                    isNextNpfTableVisible: false,
                    applyButtonText: "",
                    isApplyButtonVisible: false,
                    changeNpfMessage: "",
                    changeNpfMessageType: "Error",
                    nextMinTimeForChangeMessage: "",
                    isNextMinTimeForChangeLabelVisible: false,
                    npfTableData: []
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