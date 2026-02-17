import { Button, IconButton, Text } from '@lumx/react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/FlexBox/Stories';

import { FlexBox } from './FlexBox';

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
