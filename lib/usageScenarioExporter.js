const _ = require("lodash");
const fs = require("fs");
const utils = require("./utils");

class UsageScenarioExporter {
  constructor(config) {
    this.config = config;
    this.exportJson = {};
  }
  /**
   * Formats and prints a gas statistics table. Optionally writes to a file.
   * Based on https://github.com/nullenboom/eth-gas-reporter definition
   * @param  {Object} data   usageScenarioData instance with usageScenarios data
   */
  export(data) {
    // ---------------------------------------------------------------------------------------------
    // Assemble section: usageScenarios
    // ---------------------------------------------------------------------------------------------

    var dateStrings = this._createDateStrings();
    var fileName = dateStrings.fileName;
    this.exportJson.creation = dateStrings.creationString;

    var scenariosData = this._createExportScenariosData(data);
    this.exportJson.AnalyzedScenarios = scenariosData.AnalyzedScenarios;
    console.log(JSON.stringify(this.exportJson));

    //const rows = this._gatherAndCreatePrintRows(info);
  }

  _createExportScenariosData(info) {
    let jsonString = {
      AnalyzedScenarios: 0,
      Scenarios: []
    };
    _.forEach(info.usageScenarios, (data, methodId) => {
      if (!data) return;
      jsonString.AnalyzedScenarios++;
      //used to determine how many rows the scenario is long, starts with 1 for scenario title row
      const scenario = {
        ScenarioName: data.name,
        AnalyzedVariants: 0,
        MinTotalGasUsed: data.variants[0].totalGasUsed,
        MaxTotalGasUsed: data.variants[0].totalGasUsed,
        Variants: []
      };
      scenario.ScenarioName = data.name;
      //one iteration to check for min and max Gas values
      data.variants.forEach(variant => {
        scenario.AnalyzedVariants++;
        if (scenario.MinTotalGasUsed > variant.totalGasUsed) {
          scenario.MinTotalGasUsed = variant.totalGasUsed;
        }
        if (scenario.MaxTotalGasUsed < variant.totalGasUsed) {
          scenario.MaxTotalGasUsed = variant.totalGasUsed;
        }
      });
      console.log(scenario);
      jsonString.Scenarios.push[scenario];
      console.log(JSON.stringify(jsonString));
    });

    return jsonString;
  }

  _createDateStrings() {
    var currentDate = new Date();

    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();
    var dateStrings = {};
    var fileName =
      date +
      "-" +
      (month + 1) +
      "-" +
      year +
      "_" +
      hours +
      "-" +
      minutes +
      "-" +
      seconds;
    var creationString =
      date +
      "-" +
      (month + 1) +
      "-" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    dateStrings.creationString = creationString;
    dateStrings.fileName = fileName;

    return dateStrings;
  }
}

module.exports = UsageScenarioExporter;
