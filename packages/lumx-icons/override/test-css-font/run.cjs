#!/usr/bin/env node

/**
 * Script generating a HTML+CSS demo of all our icons running on a HTTP server.
 */

const fs = require('node:fs/promises');
const path = require('node:path');

const DIR = path.resolve(__dirname);
const PKG = path.resolve(DIR, '..', '..');

async function generateTestHTMLFile() {
    console.debug('Generate HTML...');
    const { icons } = require('../generated/icon-library.json');

    let html = `<html>`;
    html += '<link href="index.css" rel="stylesheet"/>';

    for (const { name } of icons) {
        html += `<i class="mdi mdi-${name}"></i>`;
    }

    await fs.writeFile(path.join(DIR, 'index.html'), html);
}

async function generateCSSFile() {
    console.debug('Generate CSS...');
    const { pathToFileURL } = require('node:url');
    const sass = require('sass');
    const scssFile = path.resolve(PKG, 'font.scss');

    const result = await sass.compileAsync(scssFile, {
        // Load from node_modules
        importers: [{
            findFileUrl(url) {
                const loadPath = require.resolve(url + '.scss');
                return new URL(loadPath, pathToFileURL(loadPath));
            },
        }],
    });
    await fs.writeFile(path.join(DIR, 'index.css'), result.css);
}

async function copyFonts() {
    console.debug('Copy fonts...');
    const from = path.resolve(PKG, 'override/generated/fonts');
    const to = path.join(DIR, '~@lumx/icons/override/generated/fonts');
    return fs.cp(from, to, { recursive: true });
}

function runHTTPServer() {
    const { spawn } = require('child_process');
    spawn('npx', ['http-server', DIR], { stdio: 'inherit' });
}

generateTestHTMLFile();
generateCSSFile();
copyFonts();
runHTTPServer();
