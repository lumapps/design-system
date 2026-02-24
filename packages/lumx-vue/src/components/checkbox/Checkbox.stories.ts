import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/Checkbox/Stories';

import { Checkbox } from '@lumx/vue';

const { meta, ...stories } = setup({
    component: Checkbox,
    decorators: { withCombinations, withValueOnChange },
});

export default {
    title: 'LumX components/checkbox/Checkbox',
    ...meta,
};

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const IntermediateState = { ...stories.IntermediateState };
export const Disabled = { ...stories.Disabled };
