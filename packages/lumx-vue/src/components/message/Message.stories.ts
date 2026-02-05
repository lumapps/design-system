import { Message } from '@lumx/vue';

import {
    Default as DefaultConfig,
    Base,
    AllKindsWithBackground as AllKindsWithBackgroundStory,
    CustomIcon as CustomIconStory,
    ClosableMessage as ClosableMessageStory,
} from '@lumx/core/js/components/Message/Stories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import MessageDefaultVue from './Stories/MessageDefault.vue';
import MessageAllKindsVue from './Stories/MessageAllKinds.vue';
import MessageWithClose from './Stories/MessageWithClose.vue';

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
        onClose: { action: 'close-button-click' },
    },
    render: withRender({ MessageWithClose }, '{{ args.children }}'),
};
