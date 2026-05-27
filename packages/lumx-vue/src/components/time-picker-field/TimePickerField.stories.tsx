import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/TimePickerField/Stories';

import { TimePickerField } from '.';

const { meta, ...stories } = setup({
    component: TimePickerField,
    decorators: { withValueOnChange, withCombinations },
});

export default {
    title: 'LumX components/time-picker-field/TimePickerField',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithValue = { ...stories.WithValue };
export const Step15 = { ...stories.Step15 };
export const WithMinTime = { ...stories.WithMinTime };
export const WithMaxTime = { ...stories.WithMaxTime };
export const French = { ...stories.French };
export const Disabled = { ...stories.Disabled };
