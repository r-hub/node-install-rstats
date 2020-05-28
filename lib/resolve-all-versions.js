
const resolve_version = require('./resolve-version');
const ora = require('ora');

async function resolve_all_versions(versions) {
    var result;

    const spin = ora('Resolving ' + versions.length + ' R version(s)')
          .start();

    try {
        var pversions = versions.map(
            function(v) { return resolve_version(v, 'macos'); }
        );
        const result = await Promise.all(pversions);
        spin.succeed();
        return result;
    } catch(error) {
        spin.fail();
        throw error;
    }
}

module.exports = resolve_all_versions;
