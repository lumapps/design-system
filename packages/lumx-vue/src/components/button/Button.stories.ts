import { Button, ButtonProps, ColorPalette, Emphasis, Size } from '@lumx/vue';

import {
    Base as BaseStory,
    Default as DefaultStory,
    SizeAndEmphasis as SizeAndEmphasisStory,
    LinkButton as LinkButtonStory
} from '@lumx/core/js/components/Button/Stories';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';

export default {
    title: 'LumX components/button/Button',
    ...DefaultStory,
    component: Button,
};

const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];

/**
 * Default button
 */
export const Base = {
    ...BaseStory,
    render: (args: ButtonProps) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: `
            <Button v-bind="args" @click="args.onClick">
                {{ args.children }}
            </Button>
        `,
    }),
};

/**
 * All combinations of size and emphasis
 */
export const SizeAndEmphasis = {
    ...SizeAndEmphasisStory,
    render: (args: ButtonProps) => ({
        components: { Button, StoryMatrix },
        setup() {
            const sizes = [Size.s, Size.m];
            const emphasis = buttonEmphasis;
            return { sizes, args, emphasis };
        },
        template: `
            <StoryMatrix :rows="emphasis" :cols="sizes">
                <template #default="{ row, col }">
                    <Button
                        v-bind="args"
                        :size="col"
                        :emphasis="row"
                    >Button</Button>
                </template>
            </StoryMatrix>
            `,
    }),
};

export const SizeAndColors = {
    ...SizeAndEmphasisStory,
    render: (args: ButtonProps) => ({
        components: { Button, StoryMatrix },
        setup() {
            const sizes = [Size.s, Size.m];
            const colors = withUndefined(ColorPalette);
            return { sizes, args, colors };
        },
        template: `
            <StoryMatrix :rows="colors" :cols="sizes">
                <template #default="{ row, col }">
                    <Button
                        v-bind="args"
                        :size="col"
                        :color="row"
                    >Button</Button>
                </template>
            </StoryMatrix>
            `,
    }),
};

/**
 * Setting a href to transform the button into a link.
 */
export const LinkButton = {
    ...Base,
    ...LinkButtonStory,
};

export const StateVariations = {
    ...Base,
    args: {
        ...Base.args,
        color: 'red',
        isSelected: true,
        isFocused: true,
    },
};