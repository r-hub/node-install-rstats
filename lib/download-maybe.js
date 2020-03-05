
const temp = require('temp-dir');
const got = require('got');

const stream = require('stream');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const pipeline = promisify(stream.pipeline);
const unlink = promisify(fs.unlink);
const access = promisify(fs.access);

async function download_maybe(url) {
    const filename = path.join(temp, path.basename(url));

    // If the file exists, we just return it. Otherwise we download it
    // It would be great to check that it is a non-broken file somehow...

    try {
        await access(filename);

    } catch(err) {

        try {
            await pipeline(
                got.stream(url),
                fs.createWriteStream(filename)
            );

        } catch(err) {
            await unlink(filename);
            throw err;
        }
    }

    return filename;
}

module.exports = download_maybe;
