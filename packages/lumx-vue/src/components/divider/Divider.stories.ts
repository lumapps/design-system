import { setup } from '@lumx/core/js/components/Divider/Stories';

import { Divider } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Divider,
});
export default {
    title: 'LumX components/divider/Divider',
    ...meta,
};

export const Default = { ...stories.Default };
