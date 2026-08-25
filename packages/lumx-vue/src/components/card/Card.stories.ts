import { setup } from '@lumx/core/js/components/Card/Stories';

import { Card } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Card,
});
export default {
    title: 'LumX components/card/Card',
    ...meta,
};

export const Default = { ...stories.Default };
export const Elevation = { ...stories.Elevation };
export const AsElement = { ...stories.AsElement };
