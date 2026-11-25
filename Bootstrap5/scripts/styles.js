'use strict';

const path = require('path');
const { spawnSync } = require('child_process');
const { config } = require('../package.json');
const { resolveInside, run: guard } = require('./common');

const root = path.resolve(__dirname, '..');
const sassCli = path.join(root, 'node_modules', 'sass', 'sass.js');
const rtlcssCli = path.join(root, 'node_modules', 'rtlcss', 'bin', 'rtlcss.js');

function run(cli, args) {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, stdio: 'inherit' });
    if (result.error) {
        console.error(`styles.js: could not start '${path.basename(cli)}': ${result.error.message}`);
        process.exit(1);
    }

    if (result.status !== 0) {
        process.exit(result.status || 1);
    }
}

function sass(style, source, destination, loadPaths) {
    resolveInside(root, source);
    resolveInside(root, destination);
    const includes = loadPaths.reduce((args, loadPath) => args.concat(['-I', loadPath]), []);
    run(sassCli, [...includes, `--style=${style}`, source, destination]);
}

const mainSource = `${config.stylesSrc}/${config.sassFile}`;
const minCss = `${config.stylesDist}/${config.minCssFile}`;

const targets = {
    sass: () => {
        sass('expanded', mainSource, `${config.stylesDist}/${config.cssFile}`, ['node_modules/bootstrap/scss']);
        sass('compressed', mainSource, minCss, ['node_modules/bootstrap/scss']);
    },
    editor: () => sass('compressed', `${config.stylesSrc}/adminapp/${config.editorSassFile}`, `${config.stylesDist}/${config.editorCssFile}`, []),
    rtl: () => {
        resolveInside(root, minCss);
        resolveInside(root, `${config.stylesDist}/${config.minRtlCssFile}`);
        run(rtlcssCli, [minCss, `${config.stylesDist}/${config.minRtlCssFile}`]);
    }
};

const names = process.argv.slice(2);
const unknown = names.filter(name => !targets[name]);
if (names.length === 0 || unknown.length > 0) {
    console.error(`Usage: node scripts/styles.js <${Object.keys(targets).join('|')}>...`);
    process.exit(1);
}

guard(() => names.forEach(name => targets[name]()));
