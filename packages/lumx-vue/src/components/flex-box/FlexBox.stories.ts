import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/FlexBox/Stories';

import { Button, IconButton, Text } from '@lumx/vue';
import { FlexBox } from '.';

const { meta, ...stories } = setup({
    component: FlexBox,
    components: { Button, Text, IconButton },
    decorators: { withWrapper, withCombinations },
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
