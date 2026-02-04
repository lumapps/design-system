import { IconButton } from '@lumx/react';
import {
    Base as BaseStory,
    WithImage as WithImageStory,
    Default as DefaultConfig,
} from '@lumx/core/js/components/Button/IconButtonStories';
import { StateVariations } from './Button.stories';

export default {
    title: 'LumX components/button/IconButton',
    component: IconButton,
    ...DefaultConfig,
    argTypes: {
        ...DefaultConfig.argTypes,
        onClick: { action: true, table: { disable: true } },
    },
};

/**
 * Default IconButton
 */
export const Default = BaseStory;

/**
 * IconButton using an image
 */
export const WithImage = WithImageStory;

/**
 * Check icon button style variations (color, states, emphasis, etc.)
 */
export const IconStateVariations = {
    ...Default,
    argTypes: { ...Default.args, ...StateVariations.argTypes },
    decorators: StateVariations.decorators,
};
