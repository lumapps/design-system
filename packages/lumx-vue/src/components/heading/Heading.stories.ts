import {
    AllLevels as AllLevelsStory,
    Default as DefaultConfig,
    Base,
    AllTypography as AllTypographyStory,
} from '@lumx/core/js/components/Heading/Stories';
import { Heading } from '.';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import HeadingDefaultVue from './Stories/HeadingDefault.vue';
import HeadingAllLevelsVue from './Stories/HeadingAllLevels.vue';
import HeadingAllTypographyVue from './Stories/HeadingAllTypography.vue';
import HeadingNestedHeadingLevelProviderVue from './Stories/HeadingNestedHeadingLevelProvider.vue';

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
    render: withRender({ HeadingDefaultVue }, '{{ args.children }}'),
};

/**
 * All supported heading elements
 */
export const AllLevels = {
    ...AllLevelsStory,
    render: withRender({ HeadingAllLevelsVue }, '{{ args.children }}'),
};

/**
 * All typography
 */
export const AllTypography = {
    ...AllTypographyStory,
    argTypes: { typography: { control: false } },
    render: withRender({ HeadingAllTypographyVue }, '{{ args.children }}'),
};

/**
 * Nest HeadingLevelProvider to increment heading levels
 */
export const NestedHeadingLevelProvider = {
    render: withRender({ HeadingNestedHeadingLevelProviderVue }),
};
