import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonCircleStories';

import { SkeletonCircle } from '@lumx/vue';
import SkeletonCircleDefaultVue from './Stories/SkeletonCircleDefault.vue';

const { meta, AllSize, AllColor } = setup({
    component: SkeletonCircle,
    render: withRender({ SkeletonCircleDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Circle',
    ...meta,
};

export { AllSize, AllColor };
