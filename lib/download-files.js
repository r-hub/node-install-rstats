
const download_maybe = require('./download-maybe');
const ora = require('ora');

async function download_files(urls) {

    var todo = urls.length;
    const spin = ora('Downloading ' + todo + ' files');
    try {
        var pdl = urls.map(async function(url) {
            const filename = await download_maybe(url);
            todo--;
            spin.text = 'Downloading ' + todo + ' files';
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
