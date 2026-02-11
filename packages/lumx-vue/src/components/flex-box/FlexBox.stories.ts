import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/FlexBox/Stories';

import { FlexBox } from '.';
import FlexBoxNoConfigVue from './Stories/FlexBoxNoConfig.vue';
import FlexBoxNoShrinkVue from './Stories/FlexBoxNoShrink.vue';
import FlexBoxMarginAutoVue from './Stories/FlexBoxMarginAuto.vue';

const { meta, ...stories } = setup({
    component: FlexBox,
    render: withRender({ FlexBoxNoConfigVue }),
    decorators: { withWrapper, withCombinations },
    overrides: {
        NoShrink: { render: withRender({ FlexBoxNoShrinkVue }) },
        MarginAuto: { render: withRender({ FlexBoxMarginAutoVue }) },
    },
});

export default {
    title: 'LumX components/flex-box/FlexBox',
    ...meta,
};

export const NoConfig = { ...stories.NoConfig };
export const Horizontal = { ...stories.Horizontal };
export const Vertical = { ...stories.Vertical };
export const GapSizes = { ...stories.GapSizes };
export const Wrap = { ...stories.Wrap };
export const NoShrink = { ...stories.NoShrink };
export const MarginAuto = { ...stories.MarginAuto };
