import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withRender } from '@lumx/vue/stories/utils/withRender';

import {
    Default as DefaultConfig,
    NoConfig as NoConfigStory,
    Horizontal as HorizontalStory,
    Vertical as VerticalStory,
    GapSizes as GapSizesStory,
    Wrap as WrapStory,
    NoShrink as NoShrinkStory,
} from '@lumx/core/js/components/FlexBox/Stories';

import { FlexBox } from '.';
import FlexBoxNoConfigVue from './Stories/FlexBoxNoConfig.vue';
import FlexBoxHorizontalVue from './Stories/FlexBoxHorizontal.vue';
import FlexBoxVerticalVue from './Stories/FlexBoxVertical.vue';
import FlexBoxGapSizesVue from './Stories/FlexBoxGapSizes.vue';
import FlexBoxWrapVue from './Stories/FlexBoxWrap.vue';
import FlexBoxNoShrinkVue from './Stories/FlexBoxNoShrink.vue';
import FlexBoxMarginAutoVue from './Stories/FlexBoxMarginAuto.vue';

export default {
    title: 'LumX components/flex-box/FlexBox',
    component: FlexBox,
    ...DefaultConfig,
};

/**
 * Without config, FlexBox acts as a simple <div>
 */
export const NoConfig = {
    ...NoConfigStory,
    render: withRender({ FlexBoxNoConfigVue }),
    decorators: [withWrapper({ style: { border: '1px dashed red' } })],
};

/**
 * Horizontal orientation with all possible item alignments
 */
export const Horizontal = {
    ...NoConfigStory,
    ...HorizontalStory,
    args: {
        ...NoConfigStory.args,
        ...HorizontalStory.args,
    },
    render: withRender({ FlexBoxHorizontalVue }),
    decorators: [],
};

/**
 * Vertical orientation with all possible item alignments
 */
export const Vertical = {
    ...NoConfigStory,
    ...VerticalStory,
    render: withRender({ FlexBoxVerticalVue }),
    decorators: [],
};

/**
 * All gap sizes
 */
export const GapSizes = {
    ...HorizontalStory,
    ...GapSizesStory,
    render: withRender({ FlexBoxGapSizesVue }),
    decorators: [withWrapper({ style: { border: '1px dashed red' } })],
};

/**
 * Wrap items in new row or column
 */
export const Wrap = {
    ...WrapStory,
    render: withRender({ FlexBoxWrapVue }),
    decorators: [],
};

/**
 * Prevent FlexBox from shrinking into a parent flex box
 */
export const NoShrink = {
    ...NoShrinkStory,
    render: withRender({ FlexBoxNoShrinkVue }),
    decorators: [
        withWrapper({
            style: { display: 'flex', border: '1px dashed red', width: '100px', height: '100px', margin: '20px auto' },
        }),
    ],
};

/**
 * All combinations of margin auto values
 */
export const MarginAuto = {
    render: withRender({ FlexBoxMarginAutoVue }),
};
