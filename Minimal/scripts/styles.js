'use strict';

const path = require('path');
const { spawnSync } = require('child_process');
const { config } = require('../package.json');
const { resolveInside, run } = require('./common');

const root = path.resolve(__dirname, '..');
const sassCli = path.join(root, 'node_modules', 'sass', 'sass.js');

function sass(style, source, destination) {
    resolveInside(root, source);
    resolveInside(root, destination);
    const result = spawnSync(process.execPath, [sassCli, '--no-source-map', `--style=${style}`, source, destination], { cwd: root, stdio: 'inherit' });
    if (result.error) {
        console.error(`styles.js: could not start 'sass': ${result.error.message}`);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

function expandedAndCompressed(sourceDir, sourceFile, cssFile, minCssFile) {
    sass('expanded', `${sourceDir}/${sourceFile}`, `${config.stylesDist}/${cssFile}`);
    sass('compressed', `${sourceDir}/${sourceFile}`, `${config.stylesDist}/${minCssFile}`);
}

const targets = {
    sitefinity: () => expandedAndCompressed(config.sitefinityStylesSrc, config.sitefinitySassFile, config.sitefinityCssFile, config.sitefinityMinCssFile),
    build: () => expandedAndCompressed(config.stylesSrc, config.sassFile, config.cssFile, config.minCssFile),
    editor: () => sass('compressed', `${config.stylesSrc}/adminapp/${config.editorSassFile}`, `${config.stylesDist}/${config.editorCssFile}`)
};

const names = process.argv.slice(2);
const unknown = names.filter(name => !targets[name]);
if (names.length === 0 || unknown.length > 0) {
    console.error(`Usage: node scripts/styles.js <${Object.keys(targets).join('|')}>...`);
    process.exit(1);
}

run(() => names.forEach(name => targets[name]()));
