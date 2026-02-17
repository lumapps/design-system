import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Heading/Stories';

import { Heading, HeadingLevelProvider } from '.';

const { meta, ...stories } = setup({
    component: Heading,
    components: { HeadingLevelProvider },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/heading/Heading',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllLevels = { ...stories.AllLevels };
export const AllTypography = { ...stories.AllTypography };
export const NestedHeadingLevelProvider = { ...stories.NestedHeadingLevelProvider };
