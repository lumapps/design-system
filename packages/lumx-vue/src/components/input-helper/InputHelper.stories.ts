import { InputHelper, InputHelperProps, Kind } from '@lumx/vue';

import { Default as DefaultConfig, AllKinds as AllKindsStory } from '@lumx/core/js/components/InputHelper/Stories';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withSlot } from '@lumx/vue/stories/utils/withSlot';

export default {
    title: 'LumX components/input-helper/Input Helper',
    component: InputHelper,
    ...DefaultConfig,
    args: {
        ...DefaultConfig.args,
        children: 'Some helper text',
    },
};

export const Default = {
    render: (args: InputHelperProps) => ({
        components: { InputHelper },
        setup() {
            return withSlot(args);
        },
        template: `
            <InputHelper v-bind="args">
                {{ slot }}
            </InputHelper>
        `,
    }),
};

export const AllKinds = {
    ...AllKindsStory,
    render: (args: InputHelperProps) => ({
        components: { InputHelper, StoryMatrix },
        setup() {
            const kinds = withUndefined(Kind);
            return { kinds, ...withSlot(args) };
        },
        template: `
            <StoryMatrix :rows="kinds">
                <template #default="{ row }">
                    <InputHelper 
                        v-bind="args" 
                        :kind="row" 
                    >
                        {{ slot }}
                    </InputHelper>
                </template>
            </StoryMatrix>
            `,
    }),
};
