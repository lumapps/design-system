import { Message } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Message/Stories';

import { withNestedProps } from '../../stories/decorators/withNestedProps';

const { meta, Default, AllKinds, AllKindsWithBackground, CustomIcon, ClosableMessage } = setup({
    component: Message,
    decorators: { withWrapper, withCombinations },
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

export { Default, AllKinds, AllKindsWithBackground, CustomIcon, ClosableMessage };
