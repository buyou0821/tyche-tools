#!/usr/bin/env node

const program = require('commander');
const packageInfo = require('../../package');

program
  .version(packageInfo.version)
  .command('run [name]', 'run specified task')
  .parse(process.argv);

const proc = program.runningCommand;
if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

const subCmd = program.args[0];
if (!subCmd || subCmd !== 'run') {
  program.help();
}


