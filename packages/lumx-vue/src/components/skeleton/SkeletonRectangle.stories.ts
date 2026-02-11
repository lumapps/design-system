import { SkeletonRectangle } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonRectangleStories';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import SkeletonRectangleDefaultVue from './Stories/SkeletonRectangleDefault.vue';

const { AllSize, AllRatios, AllVariants, AllColors, meta } = setup({
    component: SkeletonRectangle,
    render: withRender({ SkeletonRectangleDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/skeleton/Skeleton Rectangle',
    ...meta,
};

export { AllSize, AllRatios, AllVariants, AllColors };
