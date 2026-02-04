import { Kind, Message } from '@lumx/react';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import {
    Default as DefaultConfig,
    Base,
    AllKindsWithBackground as AllKindsWithBackgroundStory,
    CustomIcon as CustomIconStory,
    ClosableMessage as ClosableMessageStory,
} from '@lumx/core/js/components/Message/Stories';

import { withNestedProps } from '../../stories/decorators/withNestedProps';

export default {
    title: 'LumX components/message/Message',
    component: Message,
    ...DefaultConfig,
};

/**
 * Default message
 */
export const Default = Base;

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...Default,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'kind', options: withUndefined(Kind) },
            },
        }),
    ],
};

/**
 * All `kind` variants with `hasBackground`
 */
export const AllKindsWithBackground = {
    ...AllKinds,
    ...AllKindsWithBackgroundStory,
};

/**
 * With custom icon
 */
export const CustomIcon = CustomIconStory;

/**
 * With close button (has background and kind info)
 */
export const ClosableMessage = {
    ...ClosableMessageStory,
    argTypes: {
        'closeButtonProps.onClick': { action: true },
    },
    decorators: [withNestedProps()],
};
