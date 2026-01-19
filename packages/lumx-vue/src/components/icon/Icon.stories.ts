import { ColorPalette, ColorVariant, Icon, IconProps, IconSizes, Size } from '@lumx/vue';

import {
    Default as DefaultConfig,
    SizeAndShape as SizeAndShapeStory,
    AllColors as AllColorsStory,
} from '@lumx/core/js/components/Icon/Stories';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

const iconSizes: Array<IconSizes> = [Size.xxs, Size.xs, Size.s, Size.m, Size.l, Size.xl, Size.xxl];

export default {
    component: Icon,
    args: Icon.defaultProps,
    title: 'LumX components/icon/Icon',
    ...DefaultConfig,
};

/**
 * All combinations of size and shape
 */
export const SizeAndShape = {
    ...SizeAndShapeStory,
    render: (args: IconProps) => ({
        components: { Icon, StoryMatrix },
        setup() {
            const sizes = withUndefined(iconSizes);
            const shapes = [true, false];
            return { sizes, args, shapes };
        },
        template: `
            <StoryMatrix :rows="shapes" :cols="sizes">
                <template #default="{ row, col }">
                    <Icon 
                        v-bind="args" 
                        :size="col"
                        :hasShape="row"
                    />
                </template>
            </StoryMatrix>
            `,
    }),
};

/**
 * All combinations of size and shape
//  */
export const AllColors = {
    ...AllColorsStory,
    render: (args: IconProps) => ({
        components: { Icon, StoryMatrix },
        setup() {
            const colors = withUndefined(ColorPalette);
            const variants = withUndefined(ColorVariant);
            return { colors, args, variants };
        },
        template: `
            <StoryMatrix :rows="colors" :cols="variants">
                <template #default="{ row, col }">
                    <Icon 
                        v-bind="args" 
                        :color="row"
                        :colorVariant="col"
                    />
                </template>
            </StoryMatrix>
            `,
    }),
};
