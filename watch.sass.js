import inquirer from 'inquirer';
import { ResourceBuilder } from './src/ResourceBuilder.js';
import { BrowserSyncDeployer } from './src/BrowserSyncDeployer.js';
import { verbose, NL } from './src/intercept.js';

const builder = new ResourceBuilder('./resources.json');
const browserSync = new BrowserSyncDeployer();
builder.stats();

if (builder.isValid()) {
  inquirer.prompt([
    {
      type: "list",
      name: "build",
      message: "Select watch or build.",
      choices: ["watch", "build"],
    },
    {
      type: "checkbox",
      name: "sites",
      message: "Select a site to watch.",
      choices: [...builder.getSites(), new inquirer.Separator()],
    }
  ]).then(function (input) {
    builder.setSites(input.sites);
    builder.monit();
    verbose(NL);

    if (input.build == 'watch') {
      browserSync.watchDirs(builder.getOutputDirs());
      browserSync.start();
      
      builder.watch();
    } else {
      builder.build();
    }

    verbose(NL);
  });
}