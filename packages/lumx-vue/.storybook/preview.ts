import type { Preview } from '@storybook/vue3-vite';
import { Theme } from '@lumx/react';
import { withLumxStyles } from './decorator';

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
        /** Add legacy material theme switcher in the toolbar */
        materialTheme: {
            name: 'Material theme',
            description: 'Activate legacy material theme',
            defaultValue: undefined,
            toolbar: {
                icon: 'paintbrush',
                items: [{ value: 'false', title: 'Default' }, { value: 'true', title: 'Legacy material theme' }],
                showName: true,
            },
        },
    },
    argTypes: {
        theme: { table: { disable: true } },
    },
    decorators: [withLumxStyles],
};
export default preview;
