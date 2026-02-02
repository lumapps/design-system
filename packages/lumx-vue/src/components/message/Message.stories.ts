import { Kind, Message, MessageProps } from '@lumx/vue';

import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import {
    Default as DefaultConfig,
    Base,
    AllKindsWithBackground as AllKindsWithBackgroundStory,
    CustomIcon as CustomIconStory,
    ClosableMessage as ClosableMessageStory,
} from '@lumx/core/js/components/Message/Stories';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';

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
    render: (args: MessageProps) => ({
        components: { Message },
        setup() {
            return { args };
        },
        template: `
            <Message v-bind="args">
                {{ args.children }}
            </Message>
        `,
    }),
};

/**
 * All `kind` variants
 */
export const AllKinds = {
    ...Default,
    render: (args: MessageProps) => ({
        components: { Message, StoryMatrix },
        setup() {
            const kinds = withUndefined(Kind);
            return { kinds, args };
        },
        template: `
            <StoryMatrix :rows="kinds">
                <template #default="{ row }">
                    <Message 
                        v-bind="args" 
                        :kind="row" 
                    >
                        {{ args.children }}
                    </Message>
                </template>
            </StoryMatrix>
            `,
    }),
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
    decorators: [withNestedProps()],
};
