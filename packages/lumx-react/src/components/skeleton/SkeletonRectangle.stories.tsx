import { SkeletonRectangle } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonRectangleStories';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const stories = setup({
    component: SkeletonRectangle,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    ...stories.meta,
};

export const AllSize = stories.AllSize;
export const AllRatios = stories.AllRatios;
export const AllVariants = stories.AllVariants;
export const AllColors = stories.AllColors;
