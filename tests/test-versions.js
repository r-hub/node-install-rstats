
const test = require('ava');
const resolve_version = require('../lib/resolve-version');
const url_macos = require('../lib/url-macos');

const semver = require('semver');

test('resolve_version', async t => {
    // 'devel' is 'devel'
    t.is(await resolve_version('devel'), 'devel');

    // Version number is checked and returned
    const r362 = await resolve_version('3.6.2');
    t.is(r362, '3.6.2');

    // Errors if unknown
    const err = await t.throwsAsync(resolve_version('0.0.1'));
    t.is(err.message, 'Unknown R version: 0.0.1');

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
    t.is(
        url_macos('devel'),
        'http://mac.r-project.org/el-capitan/R-devel/R-devel-el-capitan-signed.pkg'
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
