import type { Preview } from '@storybook/vue3-vite';

import '@lumx/core/scss/lumx.scss';
import 'focus-visible';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;