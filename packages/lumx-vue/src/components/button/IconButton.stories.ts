import { IconButton, IconButtonProps } from '@lumx/vue';

import {
    Base as BaseStory,
    WithImage as WithImageStory,
    Default as DefaultConfig,
} from '@lumx/core/js/components/Button/IconButtonStories';

export default {
    title: 'LumX components/button/IconButton',
    ...DefaultConfig,
    component: IconButton,
};

/**
 * Default button
 */
export const Base = {
    ...BaseStory,
    render: (args: IconButtonProps) => ({
        components: { IconButton },
        setup() {
            return { args };
        },
        template: `
            <IconButton v-bind="args" @click="args.onClick" />
        `,
    }),
};

/**
 * IconButton using an image
 */
export const WithImage = {
    ...Base,
    ...WithImageStory,
};

export const StateVariations = {
    ...Base,
    args: {
        ...Base.args,
        color: 'red',
        isSelected: true,
        isFocused: true,
    },
};
