import { SkeletonRectangle } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonRectangleStories';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';

const { meta, ...stories } = setup({
    component: SkeletonRectangle,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    ...meta,
};

export const AllSize = { ...stories.AllSize };
export const AllRatios = { ...stories.AllRatios };
export const AllVariants = { ...stories.AllVariants };
export const AllColors = { ...stories.AllColors };
