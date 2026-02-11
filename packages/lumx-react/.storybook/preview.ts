import type { Preview } from '@storybook/react-vite';
import { withGlobalTheme } from './decorators/withGlobalTheme';
import { Theme } from '@lumx/core/src/js/constants';
import '@lumx/core/stories/root-styles.scss';
import 'focus-visible';

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
    decorators: [withGlobalTheme],
};
export default preview;
