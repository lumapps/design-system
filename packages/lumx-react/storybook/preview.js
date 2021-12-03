import { withKnobs } from '@storybook/addon-knobs';
import { withStoryBlockDecorator } from './story-block/decorator';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
    withKnobs(),
    withStoryBlockDecorator
];
