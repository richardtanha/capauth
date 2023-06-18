sap.ui.define([
    "ns/risks/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "ns/risks/utils/odataUtils",
],
    
    function (
        BaseController, 
        JSONModel, 
        MessageBox, 
        MessageToast, 
        Fragment, 
        Filter,
        FilterOperator,
        odataUtils) {
        "use strict";

        return BaseController.extend("ns.risks.controller.Master", {
            onInit: function () {
                this._view = this.getView();

                // Setting the view model for busy indicators
                let viewModel = new JSONModel({
                    busy: false,
                    delay: 0,
                    noDataText: 'No risks available',
                    isValidValues: true,
                });

                let risksModel = new JSONModel();

                this.setModel(viewModel, "viewModel");
                this._viewModel = this.getModel("viewModel");
                this.setModel(risksModel, "risksModel");
                this._risksModel = this.getModel("risksModel");
                this._mainModel = this.getOwnerComponent().getModel();

                
            },
            onOpenRiskDialog: function(){
                if (!this.byId("createRiskDialog")) {
                    Fragment.load({
                      id: this._view.getId(),
                      name: "ns.risks.fragments.Master.CreateRiskDialog",
                      controller: this,
                    }).then((oFragment) => {
                      this._createRiskFragment = oFragment;
                      this._view.addDependent(this._createRiskFragment);
          
                      this._createRiskFragment.open();
                    });
                  } else {
                    this._createRiskFragment.open();
                  }
            },
            onCloseRiskDialog: function (navigate) {
                this._risksModel.setData({});
                this._viewModel.setProperty("/isValidValues", true);
                this.byId("createRiskDialog").close();
                this._viewModel.setProperty("/busy", false);
            },

            onRiskTitleChange: function(oControlEvent){
                let riskTitle = oControlEvent.getParameters("value");
                if(!riskTitle)
                    return
                this._risksModel.setProperty("/riskTitle",riskTitle?.value);
            },
            
            onRiskDescriptionChange: function(oControlEvent){
                let riskDescription = oControlEvent.getParameters("value");
                if(!riskDescription)
                    return
                this._risksModel.setProperty("/riskDescription",riskDescription?.value);
            },

            onCreateRisk: async function(){
                let payload = {
                    title: this._risksModel.getProperty("/riskTitle"),
                    descr: this._risksModel.getProperty("/riskDescription"),
                };

                try {
                    let data = await odataUtils.writeToBackend(
                      "Risks",
                      payload,
                      this._viewModel,
                      this._mainModel
                    );
                    this.onCloseRiskDialog(true);
                  } catch (error) {
                    let errorMessage = JSON.parse(error.responseText)?.error?.message
                      ?.value;
          
                    if (errorMessage && error.statusCode) {
                      MessageBox.error(
                        `Error Code: ${error.statusCode}, Error Message: ${errorMessage}`
                      );
                    } else {
                      MessageBox.error(error.responseText);
                    }
                  }
                  this._mainModel.refresh();
            },
        });
    });
