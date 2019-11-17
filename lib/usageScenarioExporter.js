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

    var currentDate = new Date();

    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var seconds = currentDate.getSeconds();

    var dateString =
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
    this.export;
    console.log(dateString);
    this.exportJson.creation = creationString;

    console.log(this.exportJson);

    console.log(JSON.stringify(data.usageScenarios));

    //const rows = this._gatherAndCreatePrintRows(info);
  }

  _gatherAndCreatePrintRows(info) {
    const rows = [];
    _.forEach(info.uS, (data, methodId) => {
      if (!data) return;
      this.scenarioAmount++;
      //used to determine how many rows the scenario is long, starts with 1 for scenario title row
      let rowSpanCount = 1;
      const scenarioRows = {
        scenarioTitleName: [],
        variants: [],
        minGasUsed: data.variants[0].totalGasUsed,
        maxGasUsed: data.variants[0].totalGasUsed
      };
      //one iteration to check for min and max Gas values
      data.variants.forEach(variant => {
        if (scenarioRows.minGasUsed > variant.totalGasUsed) {
          scenarioRows.minGasUsed = variant.totalGasUsed;
        }
        if (scenarioRows.maxGasUsed < variant.totalGasUsed) {
          scenarioRows.maxGasUsed = variant.totalGasUsed;
        }
      });

      //table.push(scenarioTitle);
      data.variants.forEach(variant => {
        const variantRows = {
          titleRow: [],
          methodRows: [],
          deploymentRows: []
        };

        rowSpanCount++;
        let variantTitleRow = this._createVariantTitleRow(
          variant,
          scenarioRows.minGasUsed,
          scenarioRows.maxGasUsed
        );
        const methodRows = this._createMethodRows(variant);
        const methodRowsLength = methodRows.length;
        const deployRows = this._createDeploymentRows(variant);
        const deployRowsLength = deployRows.length;
        rowSpanCount += methodRowsLength;
        rowSpanCount += deployRowsLength;
        variantRows.titleRow.push(variantTitleRow);
        methodRows.forEach(row => variantRows.methodRows.push(row));
        deployRows.forEach(row => variantRows.deploymentRows.push(row));
        scenarioRows.variants.push(variantRows);
        this.variantsAmount++;
      });
      //after each variant of a scenario is analyzed, we can create scenarioTitleRow
      let scenarioTitle = {
        hAlign: "left",
        colSpan: 2,
        rowSpan: rowSpanCount,
        content: colors.green.bold(data.name)
      };
      scenarioRows.scenarioTitleRow.push(scenarioTitle);
      rows.push(scenarioRows);
    });
    return rows;
  }
}

module.exports = UsageScenarioExporter;
