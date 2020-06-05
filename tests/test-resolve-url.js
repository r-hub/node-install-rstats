
const create_test_server = require('create-test-server');
const server = create_test_server();

const test = require('ava');

test('resolve_url fallback', async t => {

    const srv = await server;
    srv.get('/404', function(req, res) {
        res.sendStatus(404);
    });
    process.env.R_VERSIONS_API_URL = srv.url + '/';
    process.env.NODE_RVERSIONS_DUMMY = 'true';

    const resolve_url = require('../lib/resolve-url');

    const rrel = await resolve_url('r-release');
    t.true(!!rrel.version);

    // Unknown query
    await t.throwsAsync(resolve_url('foobar'));
});
