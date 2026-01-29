import type { Preview } from '@storybook/vue3-vite';
import { withStoryBlockDecorator } from './story-block/decorator';
import { Theme } from '@lumx/core/src/js/constants';
import '@lumx/core/scss/lumx.scss';

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
            },
        },
    },
    argTypes: {
        theme: { table: { disable: true } },
    },
    decorators: [withStoryBlockDecorator],
};
export default preview;
