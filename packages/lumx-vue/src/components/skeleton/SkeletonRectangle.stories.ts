import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonRectangleStories';

import { SkeletonRectangle } from '@lumx/vue';
import SkeletonRectangleDefaultVue from './Stories/SkeletonRectangleDefault.vue';

const { meta, AllSize, AllRatios, AllVariants, AllColors } = setup({
    component: SkeletonRectangle,
    render: withRender({ SkeletonRectangleDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    ...meta,
};

export { AllSize, AllRatios, AllVariants, AllColors };
