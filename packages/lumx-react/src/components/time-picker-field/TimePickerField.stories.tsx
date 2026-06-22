import { TimePickerField } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/TimePickerField/Stories';

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
export const WithBoundsMode = { ...stories.WithBoundsMode };
export const Disabled = { ...stories.Disabled };
