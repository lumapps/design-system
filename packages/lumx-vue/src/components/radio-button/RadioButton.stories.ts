import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/RadioButton/Stories';

import { RadioButton } from '@lumx/vue';
import RadioButtonDefaultVue from './Stories/RadioButtonDefault.vue';

const { meta, Default, LabelAndHelper, Disabled } = setup({
    component: RadioButton,
    render: withRender({ RadioButtonDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/radio-button/RadioButton',
    ...meta,
    args: {
        ...meta.args,
        isChecked: undefined, // Let the component manage its own state
    },
    argTypes: {
        ...meta.argTypes,
        onChange: { action: 'change' },
        isChecked: { control: false }, // Disable control since state is managed internally
    },
};

export { Default, LabelAndHelper, Disabled };
