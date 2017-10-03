sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter"
], function (Controller, formatter) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.NPF", {
        formatter: formatter,
        onInit: function () {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
        },
        onColumnListItemPress: function (oEvent) {
            var oItem = oEvent.getSource();                                                                 // Находим элемент на котором произошел клик
            var aCells = oItem.getAggregation("cells");                                                     // Находим все клетки в выбранной строке
            var nameNewNPF = aCells[0].getProperty("text");                                                 // Берем название нового НПФ

            this.oTechModel.setProperty("/changeNPF/newNPF",nameNewNPF);                                    // Записываем имя нового НПФ в модель
            this.oTechModel.setProperty("/tech/isButtonShowNPFApply",false);                                // В свойстве кнопки ставим "не нажата", тем самым скрываем список НПФ
            this.oTechModel.setProperty("/tech/isCustomListSelected",true);                                 // При выборе в таблице НПФа, устанавливаем видимость кнопки подтверждения true
            this.oTechModel.setProperty("/changeNPF/buttonPressCount",0);                                   // Сбрасываем счетчик нажатий на кнопке "Сменить НПФ"
        },

        onChangeNPF: function () {
            function changeVisible(model) {
                model.setProperty("/changeNPF/isWarningTextVisible",false);
            }
            this.count = this.oTechModel.getProperty("/changeNPF/buttonPressCount");                        // Получаем значение счетчика нажатия кнопки "Сменить НПФ"
            // Если кнопка не была нажата ни разу
            if(this.count == 0){
                this.oTechModel.setProperty("/changeNPF/buttonText","Все равно сменить");                   // Меняем текст кнопки
                this.oTechModel.setProperty("/changeNPF/warningText","Вы уверены? Отменить операцию будет невозможно!");
                this.oTechModel.setProperty("/changeNPF/state","Error");
                this.oTechModel.setProperty("/changeNPF/isWarningTextVisible",true);                        // Показываем сообщение с предупреждением
            }else {
                this.oTechModel.setProperty("/changeNPF/warningText","Ваш НПФ успешно сменен на новый");
                this.oTechModel.setProperty("/changeNPF/state","Success");
                this.oTechModel.setProperty("/tech/isCustomListSelected",false);                            // Скрываем кнопку "Сменить НПФ"
                //todo передача параметров не работает в IE9-
                setTimeout(changeVisible,2000,this.oTechModel);
            };
            this.oTechModel.setProperty("/changeNPF/buttonPressCount",1);
        }
    });
});