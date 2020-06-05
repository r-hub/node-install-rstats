
const create_test_server = require('create-test-server');
const server = create_test_server();
const test = require('ava');

const download_maybe = require('../lib/download-maybe');

const fs = require('fs');
const path = require('path');

const {promisify} = require('util');
const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

test('download_maybe', async t => {

    const srv = await server;
    srv.get("/get", function(req, res) {
        res.send(req.query);
    });

    // Will download to temp file. We download twice, first to get the
    // file name, then we remove the file and download it for sure.
    const url = srv.url + '/get?' + process.pid;
    const filename = await download_maybe(url);
    await unlink(filename);
    await download_maybe(url);
    t.is(path.basename(filename), 'get-' + process.pid);
    t.notThrows(async () => await access(filename));

    await writeFile(filename, 'foobar');
    await download_maybe(url);
    const cnt = await readFile(filename, 'utf8');
    t.is(cnt, 'foobar');

    await unlink(filename);
});
