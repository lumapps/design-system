import { Button, IconButton, Text } from '@lumx/react';
import { mdiAtom } from '@lumx/icons';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/FlexBox/Stories';

import { FlexBox } from './FlexBox';

const { meta, ...stories } = setup({
    component: FlexBox,
    args: {
        children: (
            <>
                <Button>Button 1</Button>
                <Text as="p">Some paragraph</Text>
                <Button>Button 3</Button>
            </>
        ),
    },
    decorators: { withWrapper, withCombinations },
    overrides: {
        NoShrink: { args: { children: <Text as="p">Some paragraph</Text> } },
        MarginAuto: { args: { children: <IconButton label="" icon={mdiAtom} /> } },
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
