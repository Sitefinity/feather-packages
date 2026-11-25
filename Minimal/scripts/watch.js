'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { config } = require('../package.json');

const root = path.resolve(__dirname, '..');
const debounceMs = 100;

const targets = {
    styles: {
        directory: config.src,
        accepts: file => file.endsWith('.scss'),
        command: 'npm run sass'
    }
};

function watch(target) {
    const directory = path.resolve(root, target.directory);
    if (!fs.existsSync(directory)) {
        console.warn(`Nothing to watch: '${target.directory}' does not exist.`);
        return;
    }

    let timer = null;
    let running = false;
    let pending = false;

    function run() {
        if (running) {
            pending = true;
            return;
        }

        running = true;
        spawn(target.command, { cwd: root, shell: true, stdio: 'inherit' }).on('close', () => {
            running = false;
            if (pending) {
                pending = false;
                run();
            }
        });
    }

    const watcher = fs.watch(directory, { recursive: true }, (eventType, file) => {
        if (file && !target.accepts(file.toString())) {
            return;
        }

        clearTimeout(timer);
        timer = setTimeout(run, debounceMs);
    });

    watcher.on('error', error => {
        console.error(error.message);
        process.exit(1);
    });

    console.log(`Watching '${target.directory}'...`);
}

const names = process.argv.slice(2);
const unknown = names.filter(name => !targets[name]);
if (names.length === 0 || unknown.length > 0) {
    console.error(`Usage: node scripts/watch.js <${Object.keys(targets).join('|')}>...`);
    process.exit(1);
}

names.forEach(name => watch(targets[name]));
