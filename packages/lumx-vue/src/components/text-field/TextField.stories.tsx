import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withRender } from '@lumx/vue/stories/utils/withRender';
import { setup } from '@lumx/core/js/components/TextField/Stories';
import { Chip, IconButton, TextField, Typography } from '@lumx/vue';
import WithChipsVue from './Stories/WithChips.vue';

const { meta, ...stories } = setup({
    component: TextField,
    components: { Chip, IconButton, Typography },
    decorators: { withValueOnChange, withCombinations },
});

export default {
    title: 'LumX components/text-field/TextField',
    ...meta,
};

export const Default = { ...stories.Default };
export const Placeholder = { ...stories.Placeholder };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const CustomLabelAndHelper = { ...stories.CustomLabelAndHelper };
export const NumberField = { ...stories.NumberField };
export const TextareaField = { ...stories.TextareaField };
export const Error = { ...stories.Error };
export const Valid = { ...stories.Valid };
export const MaxLength = { ...stories.MaxLength };
export const WithAfterElement = { ...stories.WithAfterElement };
export const WithChips = { render: withRender({ WithChipsVue }) };
export const Disabled = { ...stories.Disabled };
