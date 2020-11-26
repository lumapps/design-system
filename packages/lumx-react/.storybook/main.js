const generateDemoStories = require('./generate-demo-stories');

// Generate storybook stories from demo site demos.
generateDemoStories();

module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons: [
        '@storybook/addon-knobs/register',
        '@storybook/addon-viewport/register',
        '@storybook/addon-a11y/register',
        '@storybook/addon-actions/register',
    ],
};
