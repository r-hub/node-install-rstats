
const create_test_server = require('create-test-server');
const server = create_test_server();

const test = require('ava');
const url_macos = require('../lib/url-macos');

const semver = require('semver');

test('resolve_version', async t => {

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

    const resolve_version = require('../lib/resolve-version');

    // 'devel' is 'devel'
    t.is(await resolve_version('devel'), 'devel');

    // Version number is checked and returned
    const r362 = await resolve_version('3.6.2');
    t.is(r362, '3.6.2');

    // Default is release
    const rdef = await resolve_version();
    const rdef2 = await resolve_version('release');
    t.is(rdef, rdef2);

    // Errors if unknown
    const err = await t.throwsAsync(resolve_version('0.0.1'));
    t.is(err.message, 'Unknown R version: 0.0.1');

    // Errors if unknown
    const err2 = await t.throwsAsync(resolve_version('0.1'));
    t.is(err2.message, 'Unknown minor R version: 0.1');

    // Errors if unknown OS
    const err3 = await t.throwsAsync(resolve_version('release', 'nix'));
    t.is(err3.message, 'Unknown OS in `resolve_version()`: nix');

    // Resolves 'release' correctly
    const rls = await resolve_version('release');
    t.regex(rls, /^[0-9]+\.[0-9]+\.[0-9]+$/);

    // Resolves 'oldrel' as well
    const old = await resolve_version('oldrel');
    t.regex(old, /^[0-9]+\.[0-9]+\.[0-9]+$/);
    t.true(semver.lt(old, rls));

    // Resolves minor versions properly
    const r325 = await resolve_version('3.2');
    t.is(r325, '3.2.5');
    const r333 = await resolve_version('3.3');
    t.is(r333, '3.3.3');

    // Resolves OS specific versions
    const mac = await resolve_version('release', 'mac');
    t.regex(mac, /^[0-9]+\.[0-9]+\.[0-9]+$/);

    const win = await resolve_version('release', 'win');
    t.regex(win, /^[0-9]+\.[0-9]+\.[0-9]+$/);
});

test('url_macos', t => {
    t.regex(
        url_macos('devel'),
        /^https:\/\//
    )
    t.is(
        url_macos('3.2.5'),
        'https://cloud.r-project.org/bin/macosx/old/R-3.2.4-revised.pkg'
    )
    t.is(
        url_macos('3.6.2'),
        'https://cloud.r-project.org/bin/macosx/R-3.6.2.pkg'
    )
    t.is(
        url_macos('3.3.0'),
        'https://cloud.r-project.org/bin/macosx/old/R-3.3.0.pkg'
    )
});
