import { ColorPalette, Flag, FlagProps } from '@lumx/vue';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';

import {
    Default as DefaultConfig,
    Base,
    WithIcon as WithIconStory,
    Truncate as TruncateStory,
    AllColors as AllColorsStory,
} from '@lumx/core/js/components/Flag/Stories';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

export default {
    ...DefaultConfig,
    title: 'LumX components/flag/Flag',
    component: Flag,
};

/**
 * Default flag with label
 */
export const Default = {
    ...Base,
    render: (args: FlagProps) => ({
        components: { Flag },
        setup() {
            return { args };
        },
        template: `
            <Flag v-bind="args">
                {{ args.label }}
            </Flag>
        `,
    }),
};

/**
 * With icon
 */
export const WithIcon = {
    ...WithIconStory,
    render: (args: FlagProps) => ({
        components: { Flag },
        setup() {
            return { args };
        },
        template: `
            <Flag v-bind="args">
                {{ args.label }}
            </Flag>
        `,
    }),
};

/**
 * All `color` variants
 */
export const AllColors = {
    ...AllColorsStory,
    render: (args: FlagProps) => ({
        components: { Flag, StoryMatrix },
        setup() {
            return { colors: withUndefined(ColorPalette), args };
        },
        template: `
            <StoryMatrix :rows="colors">
                <template #default="{ row }">
                    <Flag 
                        v-bind="args" 
                        :color="row" 
                    >
                        {{ args.label }}
                    </Flag>
                </template>
            </StoryMatrix>
            `,
    }),
};

/**
 * Truncate text option
 */
export const Truncate = {
    ...Default,
    ...TruncateStory,
    decorators: [withResizableBox()],
};
