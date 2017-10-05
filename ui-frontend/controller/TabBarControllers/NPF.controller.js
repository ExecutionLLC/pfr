sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter",
    "personal/account/util/Const",
    "personal/account/util/Utils"
], function (Controller, formatter, Const, Utils) {
    "use strict";

    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        formatter: formatter,

        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            this.oMainModel = this.oComponent.getModel("mainModel");
            this.enableChangeNpfButtonTimerId = null;

            var mainModelBinding = new sap.ui.model.Binding(
                this.oMainModel, "/", this.oMainModel.getContext("/")
            );
            mainModelBinding.attachChange(this.onMainModelChanges.bind(this));
        },

        _returnNpfAdress: function (npfName) {
            // Получили набор данных пользователя
            var oListNPFModel = this.oComponent.getModel("npfModel");
            // Текущий НПФ
            var NPF = npfName;
            // Получили массив НПФ
            var aNpfs = oListNPFModel.getData();
            // В каждом эл массива ищем объект в котором
            var npfDesc = aNpfs.find(function (npfs) {
                // имя совпадает с нашим текущим
                return npfs.name === NPF;
            });

            return npfDesc.address;
        },

        enableChangeNpfButton: function(enable, nextMinTimeForChanges) {
            var oView = this.getView();

            var oButton = oView.byId('changeNpfButton');
            var oLabel = oView.byId('changeNpfLabel');
            var oText = oView.byId('changeNpfText');

            oButton.setEnabled(enable);

            if (nextMinTimeForChanges) {
                oLabel.setVisible(true);
                oText.setText(Utils.timestampToString(nextMinTimeForChanges, true));
                oText.setVisible(true);
            } else {
                oLabel.setVisible(false);
                oText.setVisible(false);
                oText.setText('');
            }
        },

        onMainModelChanges: function() {
            if(!this.oMainModel.getProperty("/snils")) {
                // user is logged out
                return;
            }

            var npfHistory = this.oMainModel.getProperty("/npfHistory");
            var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");

            var nextMinTimeForChanges = null;
            if (pendedNpfChanges.length !== 0) {
                var lastItem = pendedNpfChanges[pendedNpfChanges.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.const.TIME_NEXT_CHANGE_NPF;
            } else if (npfHistory.length !== 0) {
                var lastItem = npfHistory[npfHistory.length - 1];
                nextMinTimeForChanges = lastItem.timestamp + Const.const.TIME_NEXT_CHANGE_NPF;
            }

            var currentTime = (new Date()).valueOf();
            if (nextMinTimeForChanges && currentTime < nextMinTimeForChanges) {
                if (this.enableChangeNpfButtonTimerId) {
                    clearTimeout(this.enableChangeNpfButtonTimerId);
                }

                this.enableChangeNpfButton(false, nextMinTimeForChanges);

                this.enableChangeNpfButtonTimerId = setTimeout(function () {
                    this.enableChangeNpfButton(true);
                    this.enableChangeNpfButtonTimerId = null;
                }.bind(this), nextMinTimeForChanges - currentTime);
            } else {
                this.enableChangeNpfButton(true);
            }
        },

        onColumnListItemPress: function (oEvent) {
            // Находим элемент на котором произошел клик
            var oItem = oEvent.getSource();
            // Находим все клетки в выбранной строке
            var aCells = oItem.getAggregation("cells");
            // Берем название нового НПФ
            var nameNewNPF = aCells[0].getProperty("text");

            // Записываем имя нового НПФ в модель
            this.oTechModel.setProperty("/changeNPF/newNPF", nameNewNPF);
            // В свойстве кнопки ставим "не нажата", тем самым скрываем список НПФ
            this.oTechModel.setProperty("/tech/isButtonShowNPFApply", false);
            // При выборе в таблице НПФа, устанавливаем видимость кнопки подтверждения true
            this.oTechModel.setProperty("/tech/isCustomListSelected", true);
            // Сбрасываем счетчик нажатий на кнопке "Сменить НПФ"
            this.oTechModel.setProperty("/changeNPF/buttonPressCount", 0);
        },

        onChangeNPF: function () {
            var snils = this.oMainModel.getProperty("/snils");
            var baseUrl = Const.const.BASE_URL;
            var changeNpfURL = baseUrl + "/person/" + snils + "/npf";

            // Получаем значение счетчика нажатия кнопки "Сменить НПФ"
            this.count = this.oTechModel.getProperty("/changeNPF/buttonPressCount");
            // Если кнопка не была нажата ни разу
            if (this.count === 0) {
                // Меняем текст кнопки
                this.oTechModel.setProperty("/changeNPF/buttonText", "Все равно сменить");
                this.oTechModel.setProperty("/changeNPF/warningText", "Вы уверены? Отменить операцию будет невозможно!");
                this.oTechModel.setProperty("/changeNPF/state", "Error");
                // Показываем сообщение с предупреждением
                this.oTechModel.setProperty("/changeNPF/isWarningTextVisible", true);
            } else {

                // Формируем время след. возможной смены НПФ

                // Забрали новый НПФ из модели
                var sNewNpf = this.oTechModel.getProperty("/changeNPF/newNPF");

                var pendedNpfChanges = this.oMainModel.getProperty("/pendedTariffChanges");
                // Получаем адресс по имени НПФ
                var nNewNpfAddress = this._returnNpfAdress(sNewNpf);
                // Формируем требуемый объект для отправки на сервер
                var oNewNpfAddress = {
                    "npf": nNewNpfAddress
                };

                $.ajax({
                    url     : changeNpfURL,
                    dataType: "json",
                    type    : "PUT",
                    data    : JSON.stringify(oNewNpfAddress),
                    jsonp   : false
                });

                var now = (new Date()).valueOf();
                this.oMainModel.setProperty("/pendedNpfChanges", pendedNpfChanges.concat([{npf: nNewNpfAddress, timestamp: now}]));

                // Установили в модель дату след смены нпф (отформатирована)
                this.oTechModel.setProperty("/changeNPF/warningText", "Заявка на рассмотрении");
                this.oTechModel.setProperty("/changeNPF/state", "Warning");
                // Скрываем кнопку "Сменить НПФ"
                this.oTechModel.setProperty("/tech/isCustomListSelected", false);
                // сбрасываем графу "новый НПФ"
                this.oTechModel.setProperty("/changeNPF/newNPF","");

                /*//todo передача параметров не работает в IE9-
                setTimeout(function changeVisible(model) {
                    model.setProperty("/changeNPF/isWarningTextVisible", false);
                }, 2000, this.oTechModel);*/

                // Видимость сообщения о стадии обработки запроса
                var mainModelBinding = new sap.ui.model.Binding(
                        this.oMainModel, "/pendedNpfChanges", this.oMainModel.getContext("/pendedNpfChanges")
                );

                mainModelBinding.attachChange(function() {
                    var pendedNpfChanges = this.oMainModel.getProperty("/pendedNpfChanges");
                    var enableText = pendedNpfChanges.length === 0;
                    this.oTechModel.setProperty("/changeNPF/isWarningTextVisible", enableText);
                }.bind(this));
            }

            this.oTechModel.setProperty("/changeNPF/buttonPressCount", 1);
        }
    });
});