#!/usr/bin/env node

//Get parameters from command line
const args = process.argv.slice(2);
const source = args[0];
const destination = args[1];
const options = args[2];
//Import functions from lib.js
const { copy, move } = require('./lib');

if (options === '-c') {
  copy(source, destination)
    .then((result) => {
      console.log(`Copied ${source} to ${destination}`);
      console.log(`Total files: ${result.length}`);
    }).catch((err) => {
      console.error(err.message);
    });
}
else {
  move(source, destination)
    .then((result) => {
      console.log(`Moved ${source} to ${destination}`);
      console.log(`Total files: ${result.length}`);
    }).catch((err) => {
      console.error(err.message);
    });
}