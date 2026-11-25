'use strict';

const fs = require('fs');
const path = require('path');
const { config } = require('../package.json');
const { resolveInside, run } = require('./common');

const root = path.resolve(__dirname, '..');

// Supports '*' in the file name only (for example 'node_modules/lib/dist/*.min.js').
function expandFile(file) {
    const source = resolveInside(root, file);
    const name = path.basename(source);
    if (!name.includes('*')) {
        return [source];
    }

    const directory = path.dirname(source);
    const pattern = new RegExp('^' + name.split('*').map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/\\\\]*') + '$');
    const matches = fs.existsSync(directory)
        ? fs.readdirSync(directory, { withFileTypes: true }).filter(entry => entry.isFile() && pattern.test(entry.name)).map(entry => path.join(directory, entry.name))
        : [];
    if (matches.length === 0) {
        throw new Error(`No files match '${file}'.`);
    }

    return matches;
}

function copyFilesFlat(fileList, destinationDir) {
    fileList.split(/\s+/).filter(Boolean).flatMap(expandFile).forEach(source => {
        fs.mkdirSync(destinationDir, { recursive: true });
        fs.copyFileSync(source, path.join(destinationDir, path.basename(source)));
    });
}

const targets = {
    js: () => copyFilesFlat(config.copyJs, resolveInside(root, config.jsDist))
};

const names = process.argv.slice(2);
const unknown = names.filter(name => !targets[name]);
if (names.length === 0 || unknown.length > 0) {
    console.error(`Usage: node scripts/copy.js <${Object.keys(targets).join('|')}>...`);
    process.exit(1);
}

run(() => names.forEach(name => targets[name]()));
