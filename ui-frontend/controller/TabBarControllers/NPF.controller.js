sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const"
], function (Controller, formatter, Const) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        formatter: formatter,

        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");
        },

        _returnNpfAdress: function (npfName) {
            var oListNPFModel = this.oComponent.getModel("npfModel");                        // Получили набор данных пользователя
            var NPF = npfName;                                                               // Текущий НПФ
            var aNpfs = oListNPFModel.getData();                                            // Получили массив НПФ
            var NPFDesc = aNpfs.find(function (npfs) {                                      // В каждом эл массива ищем объект в котором
                return npfs.name === NPF;                                                   // имя совпадает с нашим текущим
            });
            return NPFDesc.address
        },


        onColumnListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();                                                                 // Находим элемент на котором произошел клик
            var aCells = oItem.getAggregation("cells");                                                     // Находим все клетки в выбранной строке
            var nameNewNPF = aCells[0].getProperty("text");                                                 // Берем название нового НПФ

            this.oTechModel.setProperty("/changeNPF/newNPF", nameNewNPF);                                    // Записываем имя нового НПФ в модель
            this.oTechModel.setProperty("/tech/isButtonShowNPFApply", false);                                // В свойстве кнопки ставим "не нажата", тем самым скрываем список НПФ
            this.oTechModel.setProperty("/tech/isCustomListSelected", true);                                 // При выборе в таблице НПФа, устанавливаем видимость кнопки подтверждения true
            this.oTechModel.setProperty("/changeNPF/buttonPressCount", 0);                                   // Сбрасываем счетчик нажатий на кнопке "Сменить НПФ"
        },


        formateDate: function (timestamp) {
            var oDate = new Date(timestamp);
            var nDay = _addLeadingZeroIfNeedIt(oDate.getDate());
            var nMonth = _addLeadingZeroIfNeedIt(oDate.getMonth() + 1);
            var nYear = oDate.getFullYear();

            function _addLeadingZeroIfNeedIt(value) {
                if (value < 10) {
                    return "0" + value
                }
                return value;
            }
            return nDay + "." + nMonth + "." + nYear
        },


        onChangeNPF: function () {
            var SNILS = "00000000101";
            var BASE_URL = Const.const.BASE_URL;
            var personInfoURL = BASE_URL + "/person/" + SNILS;
            function changeVisible(model) {
                model.setProperty("/changeNPF/isWarningTextVisible", false);
            }

            this.count = this.oTechModel.getProperty("/changeNPF/buttonPressCount");                        // Получаем значение счетчика нажатия кнопки "Сменить НПФ"
            // Если кнопка не была нажата ни разу
            if (this.count === 0) {
                this.oTechModel.setProperty("/changeNPF/buttonText", "Все равно сменить");                   // Меняем текст кнопки
                this.oTechModel.setProperty("/changeNPF/warningText", "Вы уверены? Отменить операцию будет невозможно!");
                this.oTechModel.setProperty("/changeNPF/state", "Error");
                this.oTechModel.setProperty("/changeNPF/isWarningTextVisible", true);                        // Показываем сообщение с предупреждением
            } else {

                // Формируем время след. возможной смены НПФ
                var sNewNpf = this.oTechModel.getProperty("/changeNPF/newNPF");                             // Забрали новый НПФ из модели
                var aNpfHistory = this.oMainModel.getProperty("/npfHistory");                                 // Получили историю смены НПФ
                var nLastTimestamp = aNpfHistory[aNpfHistory.length - 1].timestamp;                           // Получили последнее значение
                var nNewTimestamp = nLastTimestamp + Const.const.TIME_NEXT_CHANGE_NPF;                        // Высчитали время следующей смены НПФ
                var pendedNpfChanges = this.oMainModel.getProperty("/pendedTariffChanges");
                var nNewNpfAddress = this._returnNpfAdress(sNewNpf);                                              // Получаем адресс по имени НПФ
                var oNewNpfAddress = {                                                                            // Формируем требуемый объект для отправки на сервер
                    "npf": nNewNpfAddress
                };
                $.ajax({
                    url     : personInfoURL + "/npf",
                    dataType: "json",
                    type    : "PUT",
                    data    : JSON.stringify(oNewNpfAddress),
                    jsonp   : false
                });




                var nNow = new Date();
                this.oTechModel.setProperty("/changeNPF/NewTimestamp", nNewTimestamp);
                var sFormatDate = this.formateDate(nNewTimestamp);
                this.oTechModel.setProperty("/changeNPF/dateChangeNpf", sFormatDate);                           // Установили в модель дату след смены нпф (отформатирована)
                this.oMainModel.setProperty("/pendedNpfChanges", pendedNpfChanges.concat([{npf: nNewNpfAddress, timestamp: nNow}]));
                this.oTechModel.setProperty("/changeNPF/warningText", "Ваш НПФ успешно сменен на новый");
                this.oTechModel.setProperty("/changeNPF/state", "Success");
                this.oTechModel.setProperty("/tech/isCustomListSelected", false);                               // Скрываем кнопку "Сменить НПФ"
                this.oTechModel.setProperty("/changeNPF/newNPF","");                                            // сбрасываем графу "новый НПФ"
                //todo передача параметров не работает в IE9-
                setTimeout(changeVisible, 2000, this.oTechModel);                                               // Устанавливаем время через которое пропадет фраза о успешной смене НПФ
            }
            ;
            this.oTechModel.setProperty("/changeNPF/buttonPressCount", 1);
        }
    });
});