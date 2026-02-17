import { ProgressLinear } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/ProgressLinear/Stories';

const { meta, ...stories } = setup({
    component: ProgressLinear,
});

export default {
    title: 'LumX components/progress/ProgressLinear',
    ...meta,
};

export const Default = { ...stories.Default };
