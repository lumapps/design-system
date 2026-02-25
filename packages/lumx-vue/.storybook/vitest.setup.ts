import { setupStorybookVitest } from '@lumx/storybook-testing/vitest-setup.ts';
import { setProjectAnnotations } from '@storybook/vue3-vite';
import * as projectAnnotations from './preview';

setupStorybookVitest(setProjectAnnotations, projectAnnotations);
