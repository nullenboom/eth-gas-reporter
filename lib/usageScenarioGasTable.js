const colors = require("colors/safe");
const _ = require("lodash");
const fs = require("fs");
const Table = require("cli-table3");
const utils = require("./utils");
const CodeChecksReport = require("./codechecksReport");

class UsageScenarioGasTable {
  constructor(config) {
    this.config = config;
    this.rows = {};
  }
  /**
   * Formats and prints a gas statistics table. Optionally writes to a file.
   * Based on https://github.com/nullenboom/eth-gas-reporter definition
   * @param  {Object} info   usageScenarioData instance with usageScenarios data
   */
  generate(info) {
    colors.enabled = !this.config.noColors || false;

    // ---------------------------------------------------------------------------------------------
    // Assemble section: usageScenarios
    // ---------------------------------------------------------------------------------------------
    let scenarioAmount = 0;
    let variantsAmount = 0;

    _.forEach(info.uS, (data, methodId) => {
      if (!data) return;
      scenarioAmount++;

      let scenarioTitle = [
        {
          hAlign: "left",
          colSpan: 2,
          rowSpan: 3,
          content: colors.green.bold(data.name)
        }
      ];
      const scenarioRows = {
        titleRow: scenarioTitle,
        variantRows: {
          title: [],
          methodRows: [],
          deploymentRows: []
        }
      };

      //table.push(scenarioTitle);
      data.variants.forEach(variant => {
        let variantTitleString =
          colors.green.bold(variant.name) +
          "\n" +
          colors.red.bold(`Total Gas Used:${variant.totalGasUsed}`);
        let variantTitle = [
          { hAlign: "left", colSpan: 2, content: variantTitleString }
          //{ hAlign: "left", colSpan: 2, content: colors.green.bold(`Total Gas Used:${variant.totalGasUsed}`) }
        ];
        // table.push(variantTitle);
        variantsAmount++;
      });
    });

    // Configure indentation for RTD
    const leftPad = this.config.rst ? "  " : "";

    // Format table
    const table = new Table({
      style: { head: [], border: [], "padding-left": 2, "padding-right": 2 },
      chars: {
        mid: "·",
        "top-mid": "|",
        "left-mid": `${leftPad}·`,
        "mid-mid": "|",
        "right-mid": "·",
        left: `${leftPad}|`,
        "top-left": `${leftPad}·`,
        "top-right": "·",
        "bottom-left": `${leftPad}·`,
        "bottom-right": "·",
        middle: "·",
        top: "-",
        bottom: "-",
        "bottom-mid": "|"
      }
    });

    // Format and load methods metrics
    const solc = utils.getSolcInfo(this.config.metadata);
    const gwei = parseInt(this.config.gasPrice);
    const rate = parseFloat(this.config.ethPrice).toFixed(2);
    const currency = `${this.config.currency.toLowerCase()}`;

    let title = [
      {
        hAlign: "center",
        colSpan: 2,
        content: colors.grey(`Solc version: ${solc.version}`)
      },
      {
        hAlign: "center",
        colSpan: 2,
        content: colors.grey(`Optimizer enabled: ${solc.optimizer}`)
      },
      {
        hAlign: "center",
        colSpan: 1,
        content: colors.grey(`Runs: ${solc.runs}`)
      },
      {
        hAlign: "center",
        colSpan: 2,
        content: colors.grey(`Block limit: ${info.blockLimit} gas`)
      },
      {
        hAlign: "center",
        colSpan: 2,
        content: colors.grey(`${gwei} gwei/gas`)
      },
      {
        hAlign: "center",
        colSpan: 2,
        content: colors.red(`${rate} ${currency}/eth`)
      }
    ];

    let methodSubtitle;
    if (this.config.ethPrice && this.config.gasPrice) {
      methodSubtitle = [
        {
          hAlign: "left",
          colSpan: 2,
          content: colors.green.bold(`Scenarios analyzed: ${scenarioAmount}`)
        },
        {
          hAlign: "left",
          colSpan: 2,
          content: colors.green.bold(`Variants analyzed: ${variantsAmount}`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.bold(`Contract`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.bold(`Method`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.green(`Min`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.green(`Max`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.green(`Avg`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.bold(`# calls`)
        },
        {
          hAlign: "center",
          colSpan: 1,
          content: colors.bold(`${this.config.currency.toLowerCase()} (avg)`)
        }
      ];
    } else {
      methodSubtitle = [
        { hAlign: "left", colSpan: 11, content: colors.green.bold("Methods") }
      ];
    }

    const header = [
      colors.bold(""),
      colors.bold(""),
      colors.bold(""),
      colors.bold(""),
      colors.green(""),
      colors.green(""),
      colors.green(""),
      colors.bold(""),
      colors.bold(""),
      colors.bold(""),
      colors.bold("")
    ];

    // ---------------------------------------------------------------------------------------------
    // Final assembly
    // ---------------------------------------------------------------------------------------------
    table.push(title);
    table.push(methodSubtitle);
    table.push(header);

    _.forEach(info.uS, (data, methodId) => {
      if (!data) return;
      scenarioAmount++;
      console.log(data);
      let scenarioTitle = [
        {
          hAlign: "left",
          colSpan: 2,
          rowSpan: 3,
          content: colors.green.bold(data.name)
        }
      ];

      table.push(scenarioTitle);
      data.variants.forEach(variant => {
        let variantTitleString =
          colors.green.bold(variant.name) +
          "\n" +
          colors.red.bold(`Total Gas Used:${variant.totalGasUsed}`);
        let variantTitle = [
          { hAlign: "left", colSpan: 2, content: variantTitleString }
          //{ hAlign: "left", colSpan: 2, content: colors.green.bold(`Total Gas Used:${variant.totalGasUsed}`) }
        ];
        table.push(variantTitle);
        variantsAmount++;
      });
    });

    let tableOutput = table.toString();

    // ---------------------------------------------------------------------------------------------
    // Print
    // ---------------------------------------------------------------------------------------------
    this.config.outputFile
      ? fs.writeFileSync(this.config.outputFile, tableOutput)
      : console.log(tableOutput);
  }

  /**
   * Writes acccumulated data and the current config to gasReporterOutput.json so it
   * can be consumed by codechecks
   * @param  {Object} info  GasData instance
   */
  saveCodeChecksData(info) {
    const output = {
      namespace: "ethGasReporter",
      config: this.config,
      info: info
    };

    if (process.env.CI) {
      fs.writeFileSync("./gasReporterOutput.json", JSON.stringify(output));
    }
  }
}

module.exports = UsageScenarioGasTable;
