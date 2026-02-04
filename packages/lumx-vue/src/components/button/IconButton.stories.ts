import { IconButton } from '@lumx/vue';

import {
    Base as BaseStory,
    WithImage as WithImageStory,
    Default as DefaultConfig,
} from '@lumx/core/js/components/Button/IconButtonStories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import IconButtonBaseVue from './Stories/IconButtonBase.vue';

export default {
    title: 'LumX components/button/IconButton',
    ...DefaultConfig,
    component: IconButton,
    argTypes: {
        ...DefaultConfig.argTypes,
        onClick: { action: 'click' },
    },
};

/**
 * Default button
 */
export const Base = {
    ...BaseStory,
    render: withRender({ IconButtonBaseVue }),
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
