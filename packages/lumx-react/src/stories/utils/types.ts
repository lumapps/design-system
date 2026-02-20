import type { StoryObj } from '@storybook/react-vite';

/** Generic story type for test stories without strict component typing. */
export type GenericStory = StoryObj<{ component(props: any): any }>;
