import { withRender } from '@lumx/vue/stories/utils/withRender';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Switch/Stories';

import { Switch } from '@lumx/vue';
import SwitchDefaultVue from './Stories/SwitchDefault.vue';

const { meta, Default, LabelAndHelper, PositionRight, Disabled } = setup({
    component: Switch,
    render: withRender({ SwitchDefaultVue }),
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/switch/Switch',
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

export { Default, LabelAndHelper, PositionRight, Disabled };
