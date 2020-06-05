
const test = require('ava');
const tempfile = require('../lib/tempfile');

const fs = require('fs');
const path = require('path');

const {promisify} = require('util');
const access = promisify(fs.access);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

test('tempfile', async t => {
    const filename = await tempfile('prefix-');
    t.notThrows(async () => await access(filename));
    t.is(path.basename(filename).slice(0, 7), 'prefix-');
    t.true(path.basename(filename).length > 10);
    const cnt = await readFile(filename, 'utf8');
    t.is(cnt, '');
    await unlink(filename);

    // Default prefix
    const filename2 = await tempfile();
    t.is(path.basename(filename2).slice(0, 5), 'node-');
    await unlink(filename2);
});
