import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/RadioButton/Stories';

import { RadioButton } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: RadioButton,
    decorators: { withCombinations, withValueOnChange },
});

export default {
    title: 'LumX components/radio-button/RadioButton',
    ...meta,
};

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const Disabled = { ...stories.Disabled };
