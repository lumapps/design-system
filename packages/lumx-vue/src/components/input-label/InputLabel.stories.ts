import { setup } from '@lumx/core/js/components/InputLabel/Stories';

import { InputLabel } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: InputLabel,
});

export default {
    title: 'LumX components/input-label/Input Label',
    ...meta,
};

export const Default = { ...stories.Default };
export const IsRequired = { ...stories.IsRequired };
export const WithCustomTypography = { ...stories.WithCustomTypography };
