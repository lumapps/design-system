import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Message/Stories';

import { Message } from '@lumx/vue';
import MessageDefaultVue from './Stories/MessageDefault.vue';

const { meta, ...stories } = setup({
    component: Message,
    render: withRender({ MessageDefaultVue }, '{{ args.children }}'),
    decorators: { withWrapper, withCombinations },
    overrides: {
        ClosableMessage: {
            args: { closeButtonLabel: 'Close' },
            argTypes: { onClose: { action: 'close' } },
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
