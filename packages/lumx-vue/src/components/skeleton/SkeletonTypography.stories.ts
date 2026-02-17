import { SkeletonTypography } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonTypographyStories';

const { meta, ...stories } = setup({
    component: SkeletonTypography,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Typography',
    ...meta,
};

export const TextTypography = { ...stories.TextTypography };
export const WidthVariations = { ...stories.WidthVariations };
export const AllColors = { ...stories.AllColors };
