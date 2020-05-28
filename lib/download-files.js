
const download_maybe = require('./download-maybe');
const ora = require('ora');

async function download_files(urls) {

    var done = 0;
    const spin = ora('Downloading files: ' + done + '/' + urls.length).start();
    try {
        var pdl = urls.map(async function(url) {
            const filename = await download_maybe(url);
            done++;
            spin.text = 'Downloading files: ' + done + '/' + urls.length;
            return filename;
        })

    } catch(error) {
        spin.fail();
        throw error;
    }

    const filenames = await Promise.all(pdl);
    spin.succeed();
    return filenames;
}

module.exports = download_files;
