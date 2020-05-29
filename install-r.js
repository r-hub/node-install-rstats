#! /usr/bin/env node

const meow = require('meow');
const installr = require('.');

const cli = meow(`
	Usage
	  $ install-r [rversion1] [rversion2] ...

	Supported R versions:
	  'release':   the current R release
	  'oldrel':    the previous minor branch
          'devel':     development snapshot
	  'x.y':       last released version of a minor branch
	  'x.y.z':     version x.y.z
`);

installr.install(cli.input);
