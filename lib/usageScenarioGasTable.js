const colors = require("colors/safe");
const _ = require("lodash");
const fs = require("fs");
const Table = require("cli-table3");
const utils = require("./utils");
const CodeChecksReport = require("./codechecksReport");

class UsageScenarioGasTable {
  constructor(config) {
    this.config = config;
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
    console.log(info.uS);
    let scenarioAmount = 0;
    let variantsAmount = 0;

    const usageScenario = [];
    //console.log(info.uS);
    _.forEach(info.uS, (data, methodId) => {
      if (!data) return;
      data.variants.forEach(variant => {
        console.log(variant);
        variantsAmount++;
      });

      scenarioAmount++;
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
        content: colors.grey(``)
      }
    ];

    let methodSubtitle;
    if (this.config.ethPrice && this.config.gasPrice) {
      const gwei = parseInt(this.config.gasPrice);
      const rate = parseFloat(this.config.ethPrice).toFixed(2);
      const currency = `${this.config.currency.toLowerCase()}`;

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
          colSpan: 3,
          content: colors.grey(`${gwei} gwei/gas`)
        },
        {
          hAlign: "center",
          colSpan: 2,
          content: colors.red(`${rate} ${currency}/eth`)
        }
      ];
    } else {
      methodSubtitle = [
        { hAlign: "left", colSpan: 9, content: colors.green.bold("Methods") }
      ];
    }

    const header = [
      colors.bold(""),
      colors.bold(""),
      colors.bold("Contract"),
      colors.bold("Method"),
      colors.green("Min"),
      colors.green("Max"),
      colors.green("Avg"),
      colors.bold("# calls"),
      colors.bold(`${this.config.currency.toLowerCase()} (avg)`)
    ];

    // ---------------------------------------------------------------------------------------------
    // Final assembly
    // ---------------------------------------------------------------------------------------------
    table.push(title);
    table.push(methodSubtitle);
    table.push(header);

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
