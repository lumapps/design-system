import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/InputLabel/Stories';

import { InputLabel } from '@lumx/vue';
import InputLabelDefaultVue from './Stories/InputLabelDefault.vue';

const { meta, ...stories } = setup({
    component: InputLabel,
    render: withRender({ InputLabelDefaultVue }, '{{ args.children }}'),
});

export default {
    title: 'LumX components/input-label/Input Label',
    ...meta,
};

export const Default = { ...stories.Default };
export const IsRequired = { ...stories.IsRequired };
export const WithCustomTypography = { ...stories.WithCustomTypography };
