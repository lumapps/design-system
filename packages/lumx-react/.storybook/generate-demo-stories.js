const path = require('path');
const glob = require('glob');
const fs = require('fs');
const lodash = require('lodash');

const generateStory = (component, storyFiles) => `/**
 * File generated when storybook is started. Do not edit directly!
 */
export default { title: 'LumX components/${lodash.kebabCase(component)}/${component} Demos' };

${storyFiles
    .map((storyFile) => {
        const fileNameWithoutExtension = path.basename(storyFile.replace(/\.\w+$/, ''));
        const storyName = lodash.startCase(fileNameWithoutExtension).replace(/ /g, '');
        const storyPath = `./${fileNameWithoutExtension}`;
        return `export { App as ${storyName} } from '${storyPath}';`;
    })
    .join('\n')}
`;

// Generate site demo component demo as stories.
function generateDemoStories() {
    if (require.main.filename.match(/test-storybook|jest-worker/)) {
        // Skip generating demo stories in test runner
        return;
    }

    // Base path for generated stories.
    const basePath = path.join(__dirname, '..', 'src', 'stories', 'generated');
    // Reset directory.
    try {
        fs.rmSync(basePath, { recursive: true });
        fs.mkdirSync(basePath, { recursive: true });
    } catch (e) {}

    const generatedStoriesFiles = [];
    const componentDemos = glob.sync(
        path.join(__dirname, '..', '..', 'site-demo', 'content', 'product', 'components', '*'),
    );
    for (const componentDemo of componentDemos) {
        const demoFiles = glob.sync(path.join(componentDemo, 'react', '*.tsx'));
        if (demoFiles.length === 0) continue;

        const component = lodash.startCase(path.basename(componentDemo)).replace(/ /g, '');
        const componentDemoDir = path.join(basePath, component);
        fs.mkdirSync(componentDemoDir);

        const storyFiles = demoFiles.map((demoFile) => {
            const storyFile = path.join(componentDemoDir, path.basename(demoFile));
            fs.symlinkSync(path.relative(path.dirname(storyFile), demoFile), storyFile);
            return storyFile;
        });

        const story = generateStory(component, storyFiles);

        const generatedDemoStoryFile = path.join(componentDemoDir, `Demos.stories.tsx`);
        fs.writeFileSync(generatedDemoStoryFile, story);

        generatedStoriesFiles.push(generatedDemoStoryFile);
    }
    return generatedStoriesFiles;
}

module.exports = generateDemoStories;
