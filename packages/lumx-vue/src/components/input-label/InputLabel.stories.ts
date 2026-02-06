import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/InputLabel/Stories';

import { InputLabel } from '@lumx/vue';
import InputLabelDefaultVue from './Stories/InputLabelDefault.vue';

const { meta, Default, IsRequired, WithCustomTypography } = setup({
    component: InputLabel,
    render: withRender({ InputLabelDefaultVue }, '{{ args.children }}'),
});

export default {
    title: 'LumX components/input-label/Input Label',
    ...meta,
};

export { Default, IsRequired, WithCustomTypography };
