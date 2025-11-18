
import type { Preview } from '@storybook/vue';
import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';

// Ensure the Composition API is installed before Storybook renders components
Vue.use(VueCompositionAPI);

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
