
const resolve_version = require('./resolve-version');
const url_macos = require('./url-macos');
const download_maybe = require('./download-maybe');
const {promisify} = require('util');
const sudo = promisify(require('sudo-prompt').exec);
const ora = require('ora');

async function install_macos(options = {}) {
    const version = await resolve_version(options.version, 'macos');
    const url = url_macos(version);
    const filename = await download_maybe(url);

    const spinner = ora('Installing R ' + version).start();
    try {
        await sudo(
            'installer -pkg ' + filename + ' -target /',
            { name: 'installr' }
        )
        spinner.succeed();
    } catch(error) {
        spinner.fail();
        throw error;
    }
}

module.exports = install_macos;
