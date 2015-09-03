#!/usr/bin/env node
'use strict';

require('babel/register')({
  optional: ['runtime'],
  stage: 0
});

var ImapCopy = require('./lib');

new ImapCopy(process.argv).run().then(
  function () {
    console.log('complete!');
    process.exit();
  },
  function (error) {
    console.log('something bad happened :(');
    console.log(error);
    process.exit();
  }
);
