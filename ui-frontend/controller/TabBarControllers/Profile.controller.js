sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "personal/account/formatter/formatter"
], function (Controller,formatter) {
    "use strict";
    return Controller.extend("personal.account.controller.TabBarControllers.Profile", {
        formatter: formatter,

        onNavigateToNPF: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("menuPage", {
                query: {
                    tab: "NPF"
                }
            }, true);
        },

        onNavigateChangeTariff: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("menuPage", {
                query: {
                    tab: "Rate"
                }
            }, true);
        },

        onChangeSelect: function (oEvent) {
            this.oComponent = this.getOwnerComponent();
            this.oTechModel = this.oComponent.getModel("techModel");
            var aOperationsTableData = this.oTechModel.getProperty("/tech/getReportTab/operationsTableData");
            var oSelect = oEvent.getSource();
            var oItem = oSelect.getSelectedItem();
            var oVizFrame = this.getView().byId("idVizFrame");
            var sSelectedKey = oItem.getKey();
            var aLastYearOperationsTableData = [];
            var oDataSet;
            if(sSelectedKey === "last-year"){
                for(var i = aOperationsTableData.length - 12; i < aOperationsTableData.length; i++){
                    aLastYearOperationsTableData.push(aOperationsTableData[i]);
                }
                this.oTechModel.setProperty("/tech/getReportTab/operationsHistoryLastYear",aLastYearOperationsTableData);
                    oDataSet = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions:[{
                        name: "Date",
                        value: {
                            path:'techModel>timestamp',
                            formatter: this.formatter.formatDate
                        }
                    }],
                    measures:[
                        {
                            name:"Salary",
                            value: {
                                path:'techModel>amount'
                            }
                        }],
                    data:{
                        path:'techModel>/tech/getReportTab/operationsHistoryLastYear'
                    }
                });

            }else {
                    oDataSet = new sap.viz.ui5.data.FlattenedDataset({
                    dimensions:[{
                        name: "Date",
                        value: {
                            path:'mainModel>timestamp',
                            formatter: this.formatter.formatDate
                        }
                    }],
                    measures:[
                        {
                            name:"Salary",
                            value: {
                                path:'mainModel>amount'
                            }
                        }],
                    data:{
                        path:'mainModel>/operationsHistory'
                    }
                });



            }
            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                "uid" : "valueAxis",
                "type" : "Measure",
                "values" : ["Salary"]
            });
            var feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                "uid" : "categoryAxis",
                "type" : "Dimension",
                "values" : ["Date"]
            });
            oVizFrame.setDataset(oDataSet);
            oVizFrame.removeAllFeeds();
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);

        }
    });
});