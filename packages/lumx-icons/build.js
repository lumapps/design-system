/* eslint-disable no-await-in-loop,import/no-extraneous-dependencies */

import glob from 'glob';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GENERATED_DIR = 'override/generated/';
const DIST_PATH = path.join(__dirname, 'dist');

try {
    await fs.rmdir(DIST_PATH, { recursive: true });
} catch (e) {
    /* empty */
}

const inputFiles = glob
    .sync('{package.json,*.scss,*.md,index.{js,d.ts},all/*.{js,d.ts}}')
    // Add generated SCSS & fonts
    .concat(glob.sync(path.join(GENERATED_DIR, '{*.scss,fonts/*}')));

const created = new Set();
async function createFolderOnce(folderPath) {
    if (!created.has(folderPath)) {
        await fs.mkdir(folderPath, { recursive: true });
        created.add(folderPath);
    }
}

for (const file of inputFiles) {
    // Prepare destination folder
    const destDir = path.join(DIST_PATH, path.dirname(file));
    await createFolderOnce(destDir);

    // Copy file
    const src = path.join(__dirname, file);
    const dest = path.join(destDir, path.basename(file));
    await fs.copyFile(src, dest);
}
