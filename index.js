const mocha = require("mocha");
const inherits = require("util").inherits;
const Base = mocha.reporters.Base;
const color = Base.color;
const log = console.log;
const utils = require("./lib/utils");
const Config = require("./lib/config");
const SyncRequest = require("./lib/syncRequest");

const scenarioGasTable = require("scenario-eth-gas-table");
const ScenarioWatcher = require("./lib/scenarioWatcher");
const ScenarioDataExporter = require("./lib/scenarioDataExporter");
/**
 * Based on the Mocha 'Spec' reporter. Watches an Ethereum test suite run
 * and collects data about method & deployments gas usage. Mocha executes the hooks
 * in this reporter synchronously so any client calls here should be executed
 * via low-level RPC interface using sync-request. (see /lib/syncRequest)
 * An exception is made for fetching gas & currency price data from coinmarketcap and
 * ethgasstation (we hope that single call will complete by the time the tests finish running)
 *
 * @param {Object} runner  mocha's runner
 * @param {Object} options reporter.options (see README example usage)
 */
function Gas(runner, options) {
  // Spec reporter
  Base.call(this, runner);
  const self = this;

  let indents = 0;
  let n = 0;
  let failed = false;
  let indent = () => Array(indents).join("  ");

  // Gas reporter setup
  const config = new Config(options.reporterOptions);
  const sync = new SyncRequest(config.url);
  const watch = new ScenarioWatcher(config);

  const scenarioDataExporter = new ScenarioDataExporter(config);

  // These call the cloud, start running them.
  utils.setGasAndPriceRates(config);

  // ------------------------------------  Runners -------------------------------------------------

  runner.on("start", () => {
    watch.data.initialize(config);
  });

  runner.on("suite", suite => {
    ++indents;
    log(color("suite", "%s%s"), indent(), suite.title);
  });

  runner.on("suite end", () => {
    --indents;
    if (indents === 1) {
      log();
    }
  });

  runner.on("pending", test => {
    let fmt = indent() + color("pending", "  - %s");
    log(fmt, test.title);
  });

  runner.on("test", test => {
    watch.beforeStartBlock = sync.blockNumber();
    watch.data.resetAddressCache();
    watch.data.initializeImplementNew(test.title, test.parent.title);
  });

  runner.on("hook end", hook => {
    if (hook.title.includes("before each")) {
      watch.itStartBlock = sync.blockNumber() + 1;
    }
  });

  runner.on("pass", test => {
    let fmt;
    let fmtArgs;
    let gasUsedString;
    let consumptionString;
    let timeSpentString = color(test.speed, "%dms");

    const gasUsed = watch.blocks(test.title, test.parent.title);

    if (gasUsed) {
      gasUsedString = color("checkmark", "%d gas");

      if (config.showTimeSpent) {
        consumptionString = " (" + timeSpentString + ", " + gasUsedString + ")";
        fmtArgs = [test.title, test.duration, gasUsed];
      } else {
        consumptionString = " (" + gasUsedString + ")";
        fmtArgs = [test.title, gasUsed];
      }

      fmt =
        indent() +
        color("checkmark", "  " + Base.symbols.ok) +
        color("pass", " %s") +
        consumptionString;
    } else {
      if (config.showTimeSpent) {
        consumptionString = " (" + timeSpentString + ")";
        fmtArgs = [test.title, test.duration];
      } else {
        consumptionString = "";
        fmtArgs = [test.title];
      }

      fmt =
        indent() +
        color("checkmark", "  " + Base.symbols.ok) +
        color("pass", " %s") +
        consumptionString;
    }
    log.apply(null, [fmt, ...fmtArgs]);
  });

  runner.on("fail", test => {
    failed = true;
    let fmt = indent() + color("fail", "  %d) %s");
    log();
    log(fmt, ++n, test.title);
  });

  runner.on("end", () => {
    let jsonAndFileName = scenarioDataExporter.export(watch.data);
    //schreiben in directory
    scenarioDataExporter.writeJsonIntoReportDirWithFilename(
      jsonAndFileName.json,
      jsonAndFileName.fileName
    );
    //ausgabe der tabelle
    let colorsActive = !config.noColors || false;
    scenarioGasTable.generateTableFromJson(jsonAndFileName.json, colorsActive);

    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */
inherits(Gas, Base);

module.exports = Gas;
