
urls = {
    macos_dev: 'https://files.r-hub.io/macos/R-devel.pkg',
    macos: 'https://cloud.r-project.org/bin/macosx/base/R-%s.pkg',
    macos_old: 'https://cloud.r-project.org/bin/macosx/R-%s.pkg',
    macos_old2: 'https://cloud.r-project.org/bin/macosx/old/R-%s.pkg',
    macos_325: 'https://cloud.r-project.org/bin/macosx/old/R-3.2.4-revised.pkg',
    win_dev: 'https://cloud.r-project.org/bin/windows/base/R-devel-win.exe',
    win: 'https://cran.r-project.org/bin/windows/base/R-%s-win.exe',
    win_old: 'https://cloud.r-project.org/bin/windows/base/old/%s/R-%s-win.exe',
    rtools: {
        '33': 'https://cloud.r-project.org/bin/windows/Rtools/Rtools33.exe',
        '35': 'https://cloud.r-project.org/bin/windows/Rtools/Rtools35.exe',
        '40': 'https://cloud.r-project.org/bin/windows/Rtools/rtools40-x86_64.exe'
    }
}

module.exports = urls;
