
const create_test_server = require('create-test-server');
const server = create_test_server();
const test = require('ava');

const download_files = require('../lib/download-files');

const {promisify} = require('util');
const fs = require('fs');
const path = require('path');
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);
const readFile = promisify(fs.readFile);

async function unlink_try(path) {
    try {
        await unlink(path);
    } catch(err) {
        // nothing
    }
}

test('download_files', async t => {

    const srv = await server;
    srv.get("/download/:cnt", function(req, res) {
        res.type("text/plain")
            .send(req.params.cnt)
    });
    srv.get("/download-fail/:cnt", function(req, res) {
        res.sendStatus(404);
    });

    const urls = [ srv.url + '/download/foo',
                   srv.url + '/download/bar',
                   srv.url + '/download/foobar' ];

    const filenames = await download_files(urls);
    await Promise.all([ unlink_try(filenames[0]),
                        unlink_try(filenames[1])]);
    await download_files(urls);

    t.is(path.basename(filenames[0]), 'foo');
    t.is(path.basename(filenames[1]), 'bar');
    t.is(path.basename(filenames[2]), 'foobar');

    t.notThrows(async () => await access(filenames[0]));
    t.notThrows(async () => await access(filenames[1]));
    t.notThrows(async () => await access(filenames[2]));

    var cnt = await readFile(filenames[0], 'utf8');
    t.is(cnt, 'foo');
    var cnt = await readFile(filenames[1], 'utf8');
    t.is(cnt, 'bar');
    var cnt = await readFile(filenames[2], 'utf8');
    t.is(cnt, 'foobar');

    await Promise.all([ unlink_try(filenames[0]),
                        unlink_try(filenames[1]),
                        unlink_try(filenames[2]) ]);

    const urls2 = [ srv.url + '/download/foo',
                    srv.url + '/download-fail/bar',
                    srv.url + '/download/foobar' ];

    await t.throwsAsync(async() => { return await download_files(urls2) });

    await Promise.all([unlink_try(filenames[0]),
                       unlink_try(filenames[1]),
                       unlink_try(filenames[2]) ]);
});
