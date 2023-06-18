sap.ui.define([], function () {
    "use strict";
  
    return {
      writeToBackend: function (entity, payload, viewModel, dataModel) {
        viewModel.setProperty("/busy", true);
  
        return new Promise(function (resolve, reject) {
          dataModel.create("/" + entity, payload, {
            success: function (data) {
              viewModel.setProperty("/busy", false);
              resolve(data);
            },
            error: function (err) {
              viewModel.setProperty("/busy", false);
              reject(err);
            },
          });
        });
      },
  
    };
  });
  