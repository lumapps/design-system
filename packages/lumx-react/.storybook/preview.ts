import type { Preview } from '@storybook/react-vite';
import { withStoryBlockDecorator } from './story-block/decorator';
import { Theme } from '@lumx/react';

const preview: Preview = {
    globalTypes: {
        /** Add Theme switcher in the toolbar */
        theme: {
            name: 'Theme',
            description: 'Dark theme switch',
            defaultValue: '',
            toolbar: {
                icon: 'mirror',
                items: [
                    { value: '', title: 'Light theme' },
                    { value: Theme.dark, title: 'Dark theme' },
                ],
                dynamicTitle: true,
                showName: true,
            },
        },
    },
    argTypes: {
        theme: { table: { disable: true } },
    },
    decorators: [withStoryBlockDecorator],
};
export default preview;
