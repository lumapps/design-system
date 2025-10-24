import { DatePickerField } from '@lumx/react';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

export default {
    title: 'LumX components/date-picker/DatePickerField',
    component: DatePickerField,
    args: {
        ...DatePickerField.defaultProps,
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
 * With default value selected and restricted range
 */
export const Restricted = {
    args: {
        ...LabelPlaceholderAndHelper.args,
        value: new Date(new Date().setDate(10)),
        minDate: new Date(new Date().setDate(4)),
        maxDate: new Date(new Date().setDate(24)),
    },
};

/**
 * With default value selected and restricted range
 */
export const RestrictedEmpty = {
    args: {
        ...LabelPlaceholderAndHelper.args,
        minDate: new Date(new Date().setDate(4)),
        maxDate: new Date(new Date().setDate(24)),
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

/**
 * Disabled states
 */
export const Disabled = {
    args: DefaultValue.args,
    decorators: [
        withCombinations({
            combinations: {
                rows: {
                    disabled: { disabled: true },
                    'aria-disabled': { 'aria-disabled': true },
                },
            },
        }),
    ],
};
