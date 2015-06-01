'use strict';

var Imap = require('imap');
var inspect = require('util').inspect;
var fs = require('fs');
var _ = require('lodash');
var options = require('commander');
var pkg = require('./package.json');

options.
  version(pkg.version)
  .option('-c, --config [configFile]', 'The path to the config file containing log in info', 'config.json')
  .option('-u, --uids [uidFile]', 'The path to store known email identifiers', 'uidsync.log')
  .option('-s, --source [mailbox]', 'The source mailbox name')
  .option('-d, --dest [mailbox]', 'The dest mailbox name')
  .parse(process.argv);

if (!options.source || !options.dest) {
  console.error('Must specify dest and source mailboxes');
  process.exit(1);
}

var config = JSON.parse(fs.readFileSync(options.config, 'utf8'));
var knownUids = [];


try {
  var uidlist = fs.readFileSync(options.uids, {encoding: 'utf8'});
  knownUids = JSON.parse('[' + uidlist + '-1]'); //swallows last comma
  console.log('I already know %d messages', knownUids.length-1);
}
catch (e) {
  console.log('First-time sync');
}

var uidFile = fs.createWriteStream('uidsync.log', {flags: 'a', encoding: 'utf8'});

var source = new Imap(config.source);
var dest = new Imap(config.dest);
var init = {};

source.once('ready', function () { begin('source'); });
dest.once('ready', function () { begin('dest'); });

function begin(channel) {
  console.log('channel %s connected', channel);
  init[channel] = true;

  if (init.source && init.dest) {
    source.openBox(options.source, true, function (err, srcBox) {
      if (err) throw err;
      console.log('source: opened mailbox');

      source.search(['ALL'], function (err, uids) {
        console.log('search found %d messages', uids.length);
        uids = _.difference(uids, knownUids);
        console.log('%d unique', uids.length);
        syncMessage(0, uids);
      });
    });
  }
}

function syncMessage(i, uids) {
  var messages = source.fetch(uids[i], {
    bodies: '',
  });

  messages.on('message', function (msg, seqno) {
    var buffer = '', attribs;

    msg.on('attributes', function (attrs) {
      attribs = attrs;
    });

    msg.on('body', function (stream, info) {
      stream.on('data', function (chunk) {
        buffer += chunk.toString('utf8');
      });
    });

    msg.on('end', function () {
      console.log('Message %d/%d %s (%s)', i+1, uids.length, attribs.date, attribs.uid);
      uidFile.write(attribs.uid + ',');
      dest.append(buffer, {mailbox: options.dest, flags: attribs.flags, date: attribs.date});
    });
  });

  messages.once('end', function () {
    if (i >= uids.length-1) {
      console.log('All done');
      process.exit(0);
    } else {
      syncMessage(i+1, uids);
    }
  });
}


function connError(err) {
  console.log('UNHANDLED ERROR');
  console.log(err);
}

function connEnded() {
  console.log('Connection ended');
}

source.on('error', connError);
dest.on('error', connError);
source.once('end', connEnded);
dest.once('end', connEnded);

source.connect();
dest.connect();
