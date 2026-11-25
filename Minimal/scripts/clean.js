'use strict';

const fs = require('fs');
const path = require('path');
const { config } = require('../package.json');
const { resolveInside, run } = require('./common');

run(() => {
    const distDirectory = resolveInside(path.resolve(__dirname, '..'), config.dist);

    if (fs.existsSync(distDirectory)) {
        if (fs.lstatSync(distDirectory).isSymbolicLink()) {
            throw new Error(`'${config.dist}' is a symbolic link; refusing to clean it.`);
        }

        fs.readdirSync(distDirectory).forEach(entry => {
            fs.rmSync(path.join(distDirectory, entry), { recursive: true, force: true });
        });
    }
});
