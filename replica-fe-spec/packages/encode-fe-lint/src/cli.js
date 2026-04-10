#!/usr/bin/env node
const init = require('./actions/init');
const scan = require('./actions/scan');

function printUsage() {
  console.log(`encode-fe-lint skeleton

Usage:
  encode-fe-lint init [dir]
  encode-fe-lint scan [dir]
  encode-fe-lint fix [dir]
  encode-fe-lint update
`);
}

async function main() {
  const [command, target] = process.argv.slice(2);
  const currentWorkingDir = process.cwd();

  if (!command || command === '-h' || command === '--help') {
    printUsage();
    return;
  }

  if (command === '--version' || command === '-v') {
    console.log('0.0.0');
    return;
  }

  if (command === 'init') {
    const result = await init({ cwd: target || currentWorkingDir });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === 'scan') {
    const result = await scan({
      cwd: currentWorkingDir,
      include: target || currentWorkingDir
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === 'fix') {
    const result = await scan({
      cwd: currentWorkingDir,
      include: target || currentWorkingDir,
      fix: true
    });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === 'update') {
    console.log('update command is reserved for the real implementation');
    return;
  }

  printUsage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
