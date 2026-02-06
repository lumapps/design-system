import { Button } from '@lumx/vue';

import {
    Base as BaseStory,
    Default as DefaultStory,
    SizeAndEmphasis as SizeAndEmphasisStory,
    LinkButton as LinkButtonStory,
} from '@lumx/core/js/components/Button/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import ButtonBaseVue from './Stories/ButtonBase.vue';
import ButtonSizeAndEmphasisVue from './Stories/ButtonSizeAndEmphasis.vue';
import ButtonSizeAndColorsVue from './Stories/ButtonSizeAndColors.vue';
import ButtonWithTextVue from './Stories/ButtonWithText.vue';

export default {
    title: 'LumX components/button/Button',
    ...DefaultStory,
    component: Button,
    argTypes: {
        ...DefaultStory.argTypes,
        onClick: { action: 'click' },
    },
};

/**
 * Default button
 */
export const Base = {
    ...BaseStory,
    render: withRender({ ButtonBaseVue }, '{{ args.children }}'),
};

/**
 * All combinations of size and emphasis
 */
export const SizeAndEmphasis = {
    ...SizeAndEmphasisStory,
    render: withRender({ ButtonSizeAndEmphasisVue }),
};

export const SizeAndColors = {
    ...SizeAndEmphasisStory,
    render: withRender({ ButtonSizeAndColorsVue }),
};

/**
 * Setting a href to transform the button into a link.
 */
export const LinkButton = {
    ...Base,
    ...LinkButtonStory,
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

/**
 * Button with Text component as children
 */
export const WithTextComponent = {
    ...Base,
    render: withRender({ ButtonWithTextVue }),
};
