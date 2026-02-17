import { Message } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Message/Stories';

import { withNestedProps } from '../../stories/decorators/withNestedProps';

const { meta, ...stories } = setup({
    component: Message,
    decorators: { withCombinations },
    overrides: {
        ClosableMessage: {
            args: { 'closeButtonProps.label': 'Close' },
            argTypes: { 'closeButtonProps.onClick': { action: true } },
            decorators: [withNestedProps()],
        },
    },
});

export default {
    title: 'LumX components/message/Message',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllKinds = { ...stories.AllKinds };
export const AllKindsWithBackground = { ...stories.AllKindsWithBackground };
export const CustomIcon = { ...stories.CustomIcon };
export const ClosableMessage = { ...stories.ClosableMessage };
