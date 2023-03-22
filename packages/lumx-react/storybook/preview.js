import { withKnobs } from '@storybook/addon-knobs';
import { Theme } from '@lumx/react';
import { withStoryBlockDecorator } from './story-block/decorator';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
    withKnobs(),
    withStoryBlockDecorator
];

export const globalTypes = {
    /** Add Theme switcher in the toolbar */
    theme: {
        name: 'Theme',
        description: 'Dark theme switch',
        defaultValue: undefined,
        toolbar: {
            icon: 'mirror',
            items: Object.values(Theme),
            showName: true,
            dynamicTitle: true,
        },
    },
    /** Add legacy material theme switcher in the toolbar */
    materialTheme: {
        name: 'Material theme',
        description: 'Activate legacy material theme',
        defaultValue: undefined,
        toolbar: {
            icon: 'paintbrush',
            items: ['false', 'true'],
            showName: true,
        },
    }
};

/** Hide Theme in controls table */
export const argTypes = { theme: { table: { disable: true } } };
