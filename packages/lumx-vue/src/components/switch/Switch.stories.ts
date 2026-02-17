import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Switch/Stories';

import { Switch } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Switch,
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

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const PositionRight = { ...stories.PositionRight };
export const Disabled = { ...stories.Disabled };
