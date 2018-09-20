#!/usr/bin/env node

import program from 'commander';
import gendiff from '..';

program
  .version('0.0.10')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig, cmd) => {
    console.log(gendiff(firstConfig, secondConfig, cmd.format));
  })
  .parse(process.argv);
