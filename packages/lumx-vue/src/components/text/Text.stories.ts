import { Text, TextProps, Icon, ColorPalette, ColorVariant, WhiteSpace } from '@lumx/vue';
import { ref } from 'vue';

import { mdiEarth, mdiHeart } from '@lumx/icons';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import {
    Default as DefaultConfig,
    Base,
    NoWrap,
    Truncate,
    TruncateMultiline,
    AllWhiteSpace as AllWhiteSpaceStory,
    LongText as LongTextStory,
} from '@lumx/core/js/components/Text/Stories';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { withResizableBox } from '@lumx/vue/stories/decorators/withResizableBox';

export default {
    title: 'LumX components/text/Text',
    component: Text,
    ...DefaultConfig,
    render: (args: TextProps) => ({
        components: { Text },
        setup() {
            return { args };
        },
        template: `
            <Text v-bind="args">
                {{ args.children }}
            </Text>
        `,
    }),
};

export { Base, NoWrap, Truncate, TruncateMultiline };

/**
 * Test the update of the `title` attribute when text overflows
 */
export const TestUpdateTruncateTitleLabel = {
    render: (args: TextProps) => ({
        components: { Text },
        setup() {
            const content = ref('Some text');
            const lengthen = () => {
                content.value = `${content.value} ${content.value}`;
            };
            return { args, content, lengthen };
        },
        template: `
            <div>
                <button type="button" @click="lengthen">Lengthen text</button>
                <Text as="p" truncate style="max-width: 300px" v-bind="args">
                    {{ content }}
                </Text>
            </div>
        `,
    }),
};

export const WithColor = {
    ...Base,
    render: (args: TextProps) => ({
        components: { Text, Icon },
        setup() {
            return { args, mdiHeart, mdiEarth };
        },
        template: `
            <Text v-bind="args" color="red" colorVariant="L1">
                Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
            </Text>
        `,
    }),
};

/**
 * Long text should wrap by default
 */
export const LongText = {
    ...LongTextStory,
    decorators: [withResizableBox()],
};

/**
 * Text containing icons (should match font size)
 */
export const WithIcon = {
    ...Base,
    render: (args: TextProps) => ({
        components: { Text, Icon },
        setup() {
            return { args, mdiHeart, mdiEarth };
        },
        template: `
            <Text v-bind="args">
                Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
            </Text>
        `,
    }),
};

export const AllWhiteSpace = {
    ...AllWhiteSpaceStory,
    render: (args: TextProps) => ({
        components: { Text, StoryMatrix, Icon },
        setup() {
            const whiteSpace = Object.values(WhiteSpace);
            const styles = {
                tableStyle: { width: '500px', tableLayout: 'fixed' },
                firstColStyle: { width: '100px' },
                cellStyle: { border: '1px solid #000', width: '100%' },
            };
            return { whiteSpace, args, ...styles };
        },
        template: `
            <StoryMatrix :rows="whiteSpace" :tableStyle="tableStyle" :firstColStyle="firstColStyle" :cellStyle="cellStyle">
                <template #default="{ row }">
                    <Text 
                        v-bind="args" 
                        :whiteSpace="row" 
                    >
                        {{ args.children }}
                    </Text>
                </template>
            </StoryMatrix>
            `,
    }),
};

export const AllTypography = {
    ...Base,
    render: (args: TextProps) => ({
        components: { Text, StoryMatrix, Icon },
        setup() {
            const typos = withUndefined(ALL_TYPOGRAPHY);
            return { typos, args, mdiHeart, mdiEarth };
        },
        template: `
            <StoryMatrix :rows="typos">
                <template #default="{ row }">
                    <Text 
                        v-bind="args" 
                        :typography="row" 
                    >
                        Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
                    </Text>
                </template>
            </StoryMatrix>
            `,
    }),
};

export const AllColors = {
    ...Base,
    render: (args: TextProps) => ({
        components: { Text, StoryMatrix, Icon },
        setup() {
            const colorVariants = withUndefined(ColorVariant);
            const colors = withUndefined(ColorPalette);
            return { colorVariants, colors, args, mdiHeart, mdiEarth };
        },
        template: `
            <StoryMatrix :rows="colors" :cols="colorVariants">
                <template #default="{ row, col }">
                    <Text 
                        v-bind="args"
                        :color="row" 
                        :colorVariant="col"
                    >
                        Some text <Icon :icon="mdiHeart" /> with icons <Icon :icon="mdiEarth" />
                    </Text>
                </template>
            </StoryMatrix>
            `,
    }),
};
