
const install_win32 = require('./install-win32');
const install_macos = require('./install-macos');

async function install(options = {}) {
    if (process.platform === "win32") {
        return install_win32(options);
    } else if (process.platform === "darwin") {
        return install_macos(options);
    } else {
        throw new Error("Unsupported OS, only Windows and macOS are supported");
    }
}

module.exports = install;
