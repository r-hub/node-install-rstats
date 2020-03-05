
const rversions = require('rversions');

async function resolve_version(version, os = undefined) {
    if (version === undefined) { version = 'release'; }

    if (version === 'devel') {
        // Do nothing with devel

    } else if (version === 'release') {
        let rrls;
        if (os === undefined) {
            rrls = await rversions.r_release();
        } else if (os === 'macos' || os === 'mac' || os === 'macOS' ||
                   os === 'darwin') {
            rrls = await rversions.r_release_macos();
        } else if (os === 'windows' || os === 'win' || os === 'win32') {
            rrls = await rversions.r_release_win();
        } else {
            throw new Error('Unknown OS in `resolve_version()`: ' + os);
        }

        version = rrls.version;

    } else if (version === 'oldrel') {
        const rold = await rversions.r_oldrel();
        version = rold.version;

    } else if (/^[0-9]+\.[0-9]+$/.test(version)) {
        const maj = version.replace(/^([0-9]+)\..*$/, '$1');
        const min = version.replace(/^[0-9]+\.([0-9]+).*$/, '$1');
        const rls = await rversions.r_versions();
        const majors = rls.map(function(x) {
            return x.version.replace(/^([0-9]+)\..*$/, '$1');
        })
        const minors = rls.map(function(x) {
            return x.version.replace(/^[0-9]+\.([0-9]+).*$/, '$1');
        })
        let i;
        for (i = rls.length - 1; i >= 0; i--) {
            if (majors[i] == maj && minors[i] == min) break;
        }

        if (i < 0) {
            throw new Error('Unknown minor R version: ' + version);
        } else {
            version = rls[i].version;
        }

    } else {
        const rls = await rversions.r_versions();
        const vrs = rls.map(function(x) { return x.version; });
        if (vrs.indexOf(version) == -1) {
            throw new Error('Unknown R version: ' + version);
        }
    }

    return version;
}

module.exports = resolve_version;
