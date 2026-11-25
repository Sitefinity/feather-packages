'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const { config } = require('../package.json');
const { resolveInside } = require('./common');

const processor = postcss([autoprefixer]);

async function prefix(file) {
    const css = fs.readFileSync(file, 'utf8');
    const result = await processor.process(css, { from: file, to: file, map: false });
    fs.writeFileSync(file, result.css);
}

async function run() {
    const stylesDirectory = resolveInside(path.resolve(__dirname, '..'), config.stylesDist);
    if (!fs.existsSync(stylesDirectory)) {
        return;
    }

    const files = fs.readdirSync(stylesDirectory)
        .filter(name => name.endsWith('.css'))
        .map(name => path.join(stylesDirectory, name));

    for (const file of files) {
        await prefix(file);
    }
}

run().catch(error => {
    console.error(`postcss.js: ${error.message}`);
    process.exit(1);
});
