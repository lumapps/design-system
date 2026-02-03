import { HEADING_ELEMENTS } from '@lumx/core/stories/controls/element';
import StoryMatrix from '@lumx/vue/stories/utils/StoryMatrix.vue';
import {
    AllLevels as AllLevelsStory,
    Default as DefaultConfig,
    Base,
    AllTypography as AllTypographyStory,
} from '@lumx/core/js/components/Heading/Stories';
import { Heading, HeadingProps, HeadingLevelProvider } from '.';
import { ALL_TYPOGRAPHY } from '@lumx/core/stories/controls/typography';

export default {
    title: 'LumX components/heading/Heading',
    component: Heading,
    ...DefaultConfig,
};

/**
 * Default heading with text
 */
export const Default = {
    ...Base,
    render: (args: HeadingProps) => ({
        components: { Heading },
        setup() {
            return { args };
        },
        template: `
            <Heading v-bind="args">
                {{ args.children }}
            </Heading>
        `,
    }),
};

/**
 * All supported heading elements
 */
export const AllLevels = {
    ...AllLevelsStory,
    render: (args: HeadingProps) => ({
        components: { Heading, StoryMatrix },
        setup() {
            return { as: HEADING_ELEMENTS, args };
        },
        template: `
            <StoryMatrix :rows="as">
                <template #default="{ row }">
                    <Heading 
                        v-bind="args" 
                        :as="row" 
                    >
                        {{ args.children }}
                    </Heading>
                </template>
            </StoryMatrix>
            `,
    }),
};

/**
 * All typography
 */
export const AllTypography = {
    ...AllTypographyStory,
    argTypes: { typography: { control: false } },
    render: (args: HeadingProps) => ({
        components: { Heading, StoryMatrix },
        setup() {
            return { typos: ALL_TYPOGRAPHY, args };
        },
        template: `
            <StoryMatrix :rows="typos">
                <template #default="{ row }">
                    <Heading 
                        v-bind="args" 
                        :typography="row" 
                    >
                        {{ args.children }}
                    </Heading>
                </template>
            </StoryMatrix>
            `,
    }),
};

/**
 * Nest HeadingLevelProvider to increment heading levels
 */
export const NestedHeadingLevelProvider = {
    render: () => ({
        components: { Heading, HeadingLevelProvider },
        template: `
            <div>
                <!-- This will render a h1 -->
                <Heading>First level</Heading>
                <HeadingLevelProvider>
                    <!-- This will render a h2 -->
                    <Heading>Second Level</Heading>
                    <HeadingLevelProvider>
                        <!-- This will render a h3 -->
                        <Heading>Third Level</Heading>
                        <!-- This will also render a h3 -->
                        <Heading>Other Third Level</Heading>
                        <HeadingLevelProvider>
                            <!-- This will render a h4 -->
                            <Heading>Fourth Level</Heading>
                            <HeadingLevelProvider>
                                <!-- This will render a h5 -->
                                <Heading>Fifth Level</Heading>
                            </HeadingLevelProvider>
                        </HeadingLevelProvider>
                    </HeadingLevelProvider>
                </HeadingLevelProvider>
            </div>
        `,
    }),
};
