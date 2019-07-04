#!/usr/bin/env node

const program = require('commander');
const gulpTasks = require('../gulpfile');

program.parse(process.argv);

const runTask = task => {
  if (!(task in gulpTasks)) {
    console.log('[error] task not found')
    return
  }
  gulpTasks[task]();
};

const task = program.args[0];
if (!task) {
  program.help();
} else {
  console.log('tyche-tools run', task);
  runTask(task);
}
