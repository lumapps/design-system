import { Message } from '@lumx/vue';

import {
    Default as DefaultConfig,
    Base,
    AllKindsWithBackground as AllKindsWithBackgroundStory,
    CustomIcon as CustomIconStory,
    ClosableMessage as ClosableMessageStory,
} from '@lumx/core/js/components/Message/Stories';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import MessageDefaultVue from './Stories/MessageDefault.vue';
import MessageAllKindsVue from './Stories/MessageAllKinds.vue';

export default {
    title: 'LumX components/message/Message',
    component: Message,
    ...DefaultConfig,
};

/**
 * Default message
 */
export const Default = {
    ...Base,
    render: withRender({ MessageDefaultVue }, '{{ args.children }}'),
};

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...Default,
    render: withRender({ MessageAllKindsVue }, '{{ args.children }}'),
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
export const CustomIcon = {
    ...Default,
    ...CustomIconStory,
};

/**
 * With close button (has background and kind info)
 */
export const ClosableMessage = {
    ...Default,
    ...ClosableMessageStory,
    argTypes: {
        'closeButtonProps.onClick': { action: 'close-button-click' },
    },
    decorators: [withNestedProps()],
};
