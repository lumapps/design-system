import { setupStorybookVitest } from '@lumx/storybook-testing/vitest-setup.ts';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

setupStorybookVitest(setProjectAnnotations, projectAnnotations);
