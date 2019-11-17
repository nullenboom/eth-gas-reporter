const log = console.log;
const UsageScenarioWatcher = require("./usageScenarioWatcher");
const UsageScenarioGasTable = require("./usageScenarioGasTable");
const UsageScenarioExporter = require("./usageScenarioExporter");

class GasUsageScenario {
  constructor(runner, config, sync) {
    const watchPerUsageScenario = new UsageScenarioWatcher(config);
    const usageScenarioTable = new UsageScenarioGasTable(config);
    const usageScenarioExporter = new UsageScenarioExporter(config);

    runner.on("start", () => {
      watchPerUsageScenario.data.initialize(config);
    });

    runner.on("suite", suite => {});

    runner.on("suite end", () => {});

    runner.on("pending", test => {});

    runner.on("test", test => {
      watchPerUsageScenario.beforeStartBlock = sync.blockNumber();
      watchPerUsageScenario.data.resetAddressCache();
      /*  watchPerUsageScenario.data.initializeImplementVariant(
       test.title,
        test.parent.title
      );*/
      watchPerUsageScenario.data.initializeImplementNew(
        test.title,
        test.parent.title
      );
    });

    runner.on("hook end", hook => {
      if (hook.title.includes("before each")) {
        watchPerUsageScenario.itStartBlock = sync.blockNumber() + 1;
      }
    });

    runner.on("pass", test => {
      watchPerUsageScenario.blocks(test.title, test.parent.title);

      //table.generate(watchPerUsage.data);
    });

    runner.on("fail", test => {});

    runner.on("end", () => {
      usageScenarioTable.generate(watchPerUsageScenario.data);
      usageScenarioExporter.export(watchPerUsageScenario.data);
    });
  }
}

module.exports = GasUsageScenario;
