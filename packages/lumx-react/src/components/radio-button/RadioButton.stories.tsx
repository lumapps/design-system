import { RadioButton } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/RadioButton/Stories';

const { meta, ...stories } = setup({
    component: RadioButton,
    decorators: { withCombinations, withValueOnChange },
});

export default {
    title: 'LumX components/radio-button/Radio button',
    ...meta,
};

export const Default = { ...stories.Default };
export const LabelAndHelper = { ...stories.LabelAndHelper };
export const Disabled = { ...stories.Disabled };
