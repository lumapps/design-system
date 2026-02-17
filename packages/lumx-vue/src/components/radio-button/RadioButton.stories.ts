import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/RadioButton/Stories';

import { RadioButton } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: RadioButton,
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

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const Disabled = { ...stories.Disabled };
