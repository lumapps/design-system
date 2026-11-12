import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';

import { DEFAULT_PROPS } from './constants';
import { MONTH_BUTTON_ARGS } from './Stories';

/**
 * Setup DatePickerField stories for a specific framework (React or Vue).
 * The framework `DatePickerField` holds the dialog state and the typed text: each story is an args object.
 */
export function setup({
    component: DatePickerField,
    decorators: { withValueOnChange, withNestedProps, withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withValueOnChange' | 'withNestedProps' | 'withCombinations';
}>) {
    const meta = {
        component: DatePickerField,
        args: {
            ...DEFAULT_PROPS,
            ...MONTH_BUTTON_ARGS,
        },
        decorators: [withValueOnChange(), withNestedProps()],
    };

    /** Default date picker fields with only the required fields */
    const Default = {};

    /** With label, placeholder and helper */
    const LabelPlaceholderAndHelper = {
        args: {
            label: 'Date picker label',
            placeholder: 'Pick a date',
            helper: loremIpsum('tiny'),
        },
    };

    /** Error state */
    const Error = {
        args: {
            ...LabelPlaceholderAndHelper.args,
            hasError: true,
        },
    };

    /** With default value selected */
    const DefaultValue = {
        args: {
            ...LabelPlaceholderAndHelper.args,
            value: new Date('2019-02-28'),
        },
    };

    /** With default value selected and restricted range */
    const Restricted = {
        args: {
            ...LabelPlaceholderAndHelper.args,
            value: new Date(new Date().setDate(10)),
            minDate: new Date(new Date().setDate(4)),
            maxDate: new Date(new Date().setDate(24)),
        },
    };

    /** With restricted range and no value */
    const RestrictedEmpty = {
        args: {
            ...LabelPlaceholderAndHelper.args,
            minDate: new Date(new Date().setDate(4)),
            maxDate: new Date(new Date().setDate(24)),
        },
    };

    /** With default month */
    const DefaultMonth = {
        args: {
            ...LabelPlaceholderAndHelper.args,
            defaultMonth: new Date('2019-07-14'),
        },
    };

    /**
     * Multiple locales: the long display, the accepted typed formats (long format, and numeric date in the locale
     * field order) and the first day of the week follow the `locale` prop.
     */
    const Locales = {
        args: {
            label: 'Date',
            value: new Date('2019-02-28'),
        },
        decorators: [
            withCombinations({
                combinations: {
                    rows: {
                        'en-US': { locale: 'en-US', helper: 'Type 2/28/2019 or February 28, 2019' },
                        'en-GB': { locale: 'en-GB', helper: 'Type 28/02/2019 or 28 February 2019' },
                        'fr-FR': { locale: 'fr-FR', helper: 'Type 28/02/2019 or 28 février 2019' },
                        'de-DE': { locale: 'de-DE', helper: 'Type 28.2.2019 or 28. Februar 2019' },
                        'ja-JP': { locale: 'ja-JP', helper: 'Type 2019/2/28 or 2019年2月28日' },
                        'ar-EG': { locale: 'ar-EG', helper: 'Type ٢٨/٢/٢٠١٩, 28/2/2019 or ٢٨ فبراير ٢٠١٩' },
                    },
                },
            }),
        ],
    };

    /** With a clear button: an empty text clears the value (a date field can become empty only with a clear button) */
    const WithClearButton = {
        args: {
            ...DefaultValue.args,
            'clearButtonProps.label': 'Clear',
        },
    };

    /** Disabled states */
    const Disabled = {
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

    return {
        meta,
        Default,
        LabelPlaceholderAndHelper,
        Error,
        DefaultValue,
        Restricted,
        RestrictedEmpty,
        DefaultMonth,
        Locales,
        WithClearButton,
        Disabled,
    };
}
