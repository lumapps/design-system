import type { Preview } from '@storybook/react';
import { withStoryBlockDecorator } from './story-block/decorator';
import { Theme } from '@lumx/react';

/**
 * Import non default language to test moment local change.
 */
import 'moment/dist/locale/fr';

const preview: Preview = {
    globalTypes: {
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
        },
    },
    argTypes: {
        theme: { table: { disable: true } },
    },
    decorators: [withStoryBlockDecorator],
};
export default preview;
