import { SkeletonTypography } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonTypographyStories';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import SkeletonTypographyDefaultVue from './Stories/SkeletonTypographyDefault.vue';

const { meta, ...stories } = setup({
    component: SkeletonTypography,
    render: withRender({ SkeletonTypographyDefaultVue }),
});

export default {
    title: 'LumX components/skeleton/Skeleton Typography',
    ...meta,
};

export const TextTypography = { ...stories.TextTypography };
