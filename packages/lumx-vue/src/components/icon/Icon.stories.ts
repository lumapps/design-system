import { Icon } from '@lumx/vue';

import {
    Default as DefaultConfig,
    SizeAndShape as SizeAndShapeStory,
    AllColors as AllColorsStory,
    InsideText as InsideTextStory,
} from '@lumx/core/js/components/Icon/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import IconSizeAndShapeVue from './Stories/IconSizeAndShape.vue';
import IconAllColorsVue from './Stories/IconAllColors.vue';
import IconInsideTextVue from './Stories/IconInsideText.vue';

export default {
    component: Icon,
    title: 'LumX components/icon/Icon',
    ...DefaultConfig,
};

/**
 * All combinations of size and shape
 */
export const SizeAndShape = {
    ...SizeAndShapeStory,
    render: withRender({ IconSizeAndShapeVue }),
};

/**
 * All combinations of size and shape
//  */
export const AllColors = {
    ...AllColorsStory,
    render: withRender({ IconAllColorsVue }),
};

/**
 * Icon inside a text component
 * (renders as inline instead of block and can adapt to the verticalAlign)
 */
export const InsideText = {
    ...InsideTextStory,
    render: withRender({ IconInsideTextVue }),
};
