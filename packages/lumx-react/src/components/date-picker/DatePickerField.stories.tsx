import { DatePickerField } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/DatePicker/FieldStories';

const { meta, ...stories } = setup({
    component: DatePickerField,
    decorators: { withValueOnChange, withNestedProps, withCombinations },
});

export default {
    title: 'LumX components/date-picker/DatePickerField',
    ...meta,
};

export const Default = { ...stories.Default };
export const LabelPlaceholderAndHelper = { ...stories.LabelPlaceholderAndHelper };
export const Error = { ...stories.Error };
export const DefaultValue = { ...stories.DefaultValue };
export const Restricted = { ...stories.Restricted };
export const RestrictedEmpty = { ...stories.RestrictedEmpty };
export const DefaultMonth = { ...stories.DefaultMonth };
export const Locales = { ...stories.Locales };
export const WithClearButton = { ...stories.WithClearButton };
export const Disabled = { ...stories.Disabled };
