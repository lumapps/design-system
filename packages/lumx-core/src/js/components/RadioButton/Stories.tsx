import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';

import { DEFAULT_PROPS } from '.';

/**
 * Setup RadioButton stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component: RadioButton,
    decorators: { withCombinations, withValueOnChange },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withValueOnChange';
}>) {
    return {
        meta: {
            component: RadioButton,
            render: (args: any) => <RadioButton {...args} />,
            decorators: [
                withValueOnChange({
                    valueProp: 'isChecked',
                    valueTransform: (value) => value === 'radio-html-value',
                }),
            ],
            argTypes: {
                onChange: { action: true },
                name: { control: false },
                value: { control: false },
            },
            args: {
                ...DEFAULT_PROPS,
                isChecked: false,
                name: 'radio-html-name',
                value: 'radio-html-value',
            },
        },

        /** Default radio button */
        Default: {},

        /** With label and helper */
        LabelAndHelper: {
            argTypes: {
                label: { control: 'text' },
                helper: { control: 'text' },
            },
            args: {
                label: 'Radio button label',
                helper: loremIpsum('tiny'),
            },
        },

        /** Disabled */
        Disabled: {
            argTypes: {
                isDisabled: { control: false },
                'aria-disabled': { control: false },
            },
            args: {
                label: 'Radio button label',
                helper: 'Radio button is disabled because...',
            },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: {
                            disabled: { isDisabled: true },
                            'aria-disabled': { 'aria-disabled': true },
                        },
                    },
                }),
            ],
        },
    };
}
