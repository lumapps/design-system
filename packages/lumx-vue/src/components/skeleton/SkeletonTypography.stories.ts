import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/Skeleton/SkeletonTypographyStories';

import { SkeletonTypography } from '@lumx/vue';
import SkeletonTypographyDefaultVue from './Stories/SkeletonTypographyDefault.vue';

const { meta, TextTypography } = setup({
    component: SkeletonTypography,
    render: withRender({ SkeletonTypographyDefaultVue }),
});

export default {
    title: 'LumX components/skeleton/Skeleton Typography',
    ...meta,
};

export { TextTypography };
