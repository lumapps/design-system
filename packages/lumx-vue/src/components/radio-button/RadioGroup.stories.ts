import { withRender } from '@lumx/vue/stories/utils/withRender';

import { RadioGroup } from '@lumx/vue';
import RadioGroupDefaultVue from './Stories/RadioGroupDefault.vue';
import RadioGroupSimpleVue from './Stories/RadioGroupSimple.vue';

export default {
    title: 'LumX components/radio-button/Radio Group',
    component: RadioGroup,
    render: withRender({ RadioGroupDefaultVue }),
};

/**
 * Simple example with multiple radio buttons
 */
export const Simple = {
    render: withRender({ RadioGroupSimpleVue }),
};
