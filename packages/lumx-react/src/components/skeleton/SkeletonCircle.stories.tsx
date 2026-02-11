import { SkeletonCircle } from '@lumx/react';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonCircleStories';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

const { meta, ...stories } = setup({
    component: SkeletonCircle,
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Circle',
    ...meta,
};

export const AllColor = { ...stories.AllColor };
export const AllSize = { ...stories.AllSize };
