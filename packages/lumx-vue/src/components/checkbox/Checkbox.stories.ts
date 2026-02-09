import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Checkbox/Stories';

import { Checkbox } from '@lumx/vue';
import CheckboxDefaultVue from './Stories/CheckboxDefault.vue';

const { meta, Default, LabelAndHelper, IntermediateState, Disabled } = setup({
    component: Checkbox,
    render: withRender({ CheckboxDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/checkbox/Checkbox',
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

export { Default, LabelAndHelper, IntermediateState, Disabled };
