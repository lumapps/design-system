import { DatePickerField } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';

export default {
    title: 'LumX components/date-picker/DatePickerField',
    component: DatePickerField,
    args: {
        ...DatePickerField.defaultProps,
        locale: 'fr',
        'nextButtonProps.label': 'Next month',
        'previousButtonProps.label': 'Previous month',
    },
    decorators: [withValueOnChange(), withNestedProps()],
};

/**
 * Default date picker fields with only the required fields
 */
export const Default = {};

/**
 * With label, placeholder and helper
 */
export const LabelPlaceholderAndHelper = {
    args: {
        label: 'Date picker label',
        placeholder: 'Pick a date',
        helper: loremIpsum('tiny'),
    },
};

/**
 * Error state
 */
export const Error = {
    args: {
        ...LabelPlaceholderAndHelper.args,
        hasError: true,
    },
};

/**
 * With default value selected
 */
export const DefaultValue = {
    args: {
        ...LabelPlaceholderAndHelper.args,
        value: new Date('2019-02-28'),
    },
};

/**
 * With default month
 */
export const DefaultMonth = {
    args: {
        ...LabelPlaceholderAndHelper.args,
        defaultMonth: new Date('2019-07-14'),
    },
};
