
const create_test_server = require('create-test-server');
const server = create_test_server();

const test = require('ava');

test('resolve_all_versions', async t => {

    const srv = await server;
    srv.get(
        ['/r-release', '/r-release-macos', '/r-release-win'],
        function(req, res) { res.send({ version: '4.0.0'}); }
    );
    srv.get('/r-oldrel', function(req, res) {
        res.send({ version: '3.6.3' });
    });
    srv.get('/r-versions', function(req, res) {
        res.send([
            { version: '3.2.4' },
            { version: '3.2.5' },
            { version: '3.3.2' },
            { version: '3.3.3' },
            { version: '3.6.2' }
        ]);
    });
    process.env.R_VERSIONS_API_URL = srv.url + '/';

    const resolve_all_versions = require('../lib/resolve-all-versions');

    const vers = await resolve_all_versions([ 'devel', '3.2', 'release']);
    t.deepEqual(vers, [ 'devel', '3.2.5', '4.0.0' ]);

    await t.throwsAsync(
        async() => { await resolve_all_versions(['foo']) }
    );
});
