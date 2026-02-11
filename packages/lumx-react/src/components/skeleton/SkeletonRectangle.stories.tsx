import { SkeletonRectangle } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonRectangleStories';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const { AllSize, AllRatios, AllVariants, AllColors, meta } = setup({
    component: SkeletonRectangle,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    ...meta,
};

export { AllSize, AllRatios, AllVariants, AllColors };
