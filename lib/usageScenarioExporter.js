const _ = require("lodash");
const fs = require("fs");
const utils = require("./utils");

class UsageScenarioExporter {
  constructor(config) {
    this.config = config;
    this.exportJson = {};
    this.scenarioJson = {};
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
    this.exportJson.analyzedScenarios = scenariosData.analyzedScenarios;
    this.exportJson.scenarios = scenariosData.scenarios;
    console.log(JSON.stringify(this.exportJson));

    //const rows = this._gatherAndCreatePrintRows(info);
  }

  _createExportScenariosData(info) {
    const jsonString = {
      analyzedScenarios: 0,
      scenarios: []
    };

    _.forEach(info.usageScenarios, (data, methodId) => {
      if (!data) return;
      jsonString.analyzedScenarios++;
      //getMinAndMaxTotalGasUsed values for scenario
      let minAndMaxTotalGasUsed = this._getMinAndMaxTotalGasUsed(data.variants);
      //used to determine how many rows the scenario is long, starts with 1 for scenario title row
      const scenarioData = {
        scenarioName: data.name,
        analyzedVariants: 0,
        minTotalGasUsed: minAndMaxTotalGasUsed.minTotalGasUsed,
        maxTotalGasUsed: minAndMaxTotalGasUsed.maxTotalGasUsed,
        variants: []
      };

      //one iteration to check for min and max Gas values
      data.variants.forEach(variant => {
        scenarioData.analyzedVariants++;
        const variantData = {
          variantName: variant.name,
          totalGasUsed: variant.totalGasUsed,
          methods: this._createMethodData(variant),
          deployments: []
        };
        scenarioData.variants.push(variantData);
      });
      jsonString.scenarios.push(scenarioData);
    });

    return jsonString;
  }

  /**
   * Generates method rows for one variant
   * @param  {Object} variant variant Object with methods and deployment data
   */
  _createMethodData(variant) {
    const methodData = [];

    _.forEach(variant.methods, (data, methodId) => {
      let stats = {};
      stats.contractName = data.contract;
      stats.methodName = data.method;
      stats.numberOfCalls = data.numberOfCalls.toString();

      const total = data.gasData.reduce((acc, datum) => acc + datum, 0);
      stats.averageGasUsed = Math.round(total / data.gasData.length);
      stats.totalGasUsed = total;
      stats.percentageOfScenario = total / variant.totalGasUsed;

      const sortedData = data.gasData.sort((a, b) => a - b);
      stats.min = sortedData[0];
      stats.max = sortedData[sortedData.length - 1];

      methodData.push(stats);
    });
    return methodData;
  }

  _createDeploymentData(variant) {
    const deployData = [];

    // Alphabetize contract names
    variant.deployments.sort((a, b) => a.name.localeCompare(b.name));

    variant.deployments.forEach(contract => {
      let stats = {};
      if (!contract.gasData.length) return;
      stats.contractName = data.contract;
      stats.numberOfDeployments = data.contract;
    });
  }

  _getMinAndMaxTotalGasUsed(variants) {
    var min = variants[0].totalGasUsed;
    var max = variants[0].totalGasUsed;

    variants.forEach(variant => {
      if (min > variant.totalGasUsed) {
        min = variant.totalGasUsed;
      }
      if (max < variant.totalGasUsed) {
        max = variant.totalGasUsed;
      }
    });

    let minMaxGasUsed = {
      minTotalGasUsed: min,
      maxTotalGasUsed: max
    };

    return minMaxGasUsed;
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
