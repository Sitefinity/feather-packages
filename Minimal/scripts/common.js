'use strict';

const path = require('path');

// Resolves a path from package.json and refuses anything outside of the package folder (including the folder itself).
function resolveInside(root, relativePath) {
    const relative = path.relative(root, path.resolve(root, relativePath));
    if (relative === '' || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) {
        throw new Error(`'${relativePath}' must point inside the package folder.`);
    }

    return path.resolve(root, relativePath);
}

function run(action) {
    try {
        action();
    } catch (error) {
        console.error(`${path.basename(process.argv[1])}: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { resolveInside, run };
