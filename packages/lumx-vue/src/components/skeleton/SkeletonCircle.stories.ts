import { SkeletonCircle } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonCircleStories';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import SkeletonCircleDefaultVue from './Stories/SkeletonCircleDefault.vue';

const { meta, ...stories } = setup({
    component: SkeletonCircle,
    render: withRender({ SkeletonCircleDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Circle',
    ...meta,
};

export const AllColor = { ...stories.AllColor };
export const AllSize = { ...stories.AllSize };
