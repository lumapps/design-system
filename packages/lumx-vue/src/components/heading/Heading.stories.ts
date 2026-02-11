import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Heading/Stories';

import { Heading } from '.';
import HeadingDefaultVue from './Stories/HeadingDefault.vue';
import HeadingNestedHeadingLevelProviderVue from './Stories/HeadingNestedHeadingLevelProvider.vue';

const { meta, ...stories } = setup({
    component: Heading,
    render: withRender({ HeadingDefaultVue }, '{{ args.children }}'),
    decorators: { withWrapper, withCombinations },
    overrides: {
        NestedHeadingLevelProvider: { render: withRender({ HeadingNestedHeadingLevelProviderVue }) },
    },
});

export default {
    title: 'LumX components/heading/Heading',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllLevels = { ...stories.AllLevels };
export const AllTypography = { ...stories.AllTypography };
export const NestedHeadingLevelProvider = { ...stories.NestedHeadingLevelProvider };
