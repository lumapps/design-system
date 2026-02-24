import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';

import { DEFAULT_PROPS } from '.';

/**
 * Setup Checkbox stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component: Checkbox,
    decorators: { withCombinations, withValueOnChange },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withValueOnChange';
}>) {
    return {
        meta: {
            component: Checkbox,
            render: (args: any) => <Checkbox {...args} />,
            decorators: [withValueOnChange({ valueProp: 'isChecked' })],
            argTypes: {
                onChange: { action: true },
                name: { control: false },
                value: { control: false },
            },
            args: {
                ...DEFAULT_PROPS,
                isChecked: false,
                name: 'checkbox-html-name',
                value: 'checkbox-html-value',
            },
        },

        /** Default checkbox */
        Default: {},

        /** With label and helper */
        LabelAndHelper: {
            argTypes: {
                label: { control: 'text' },
                helper: { control: 'text' },
            },
            args: {
                label: 'Checkbox label',
                helper: loremIpsum('tiny'),
            },
        },

        /** With intermediate state */
        IntermediateState: {
            argTypes: {
                isChecked: { control: false },
            },
            args: {
                isChecked: 'intermediate',
            },
        },

        /** Disabled */
        Disabled: {
            argTypes: {
                isDisabled: { control: false },
                'aria-disabled': { control: false },
            },
            args: {
                label: 'Checkbox label',
                helper: 'Checkbox is disabled because...',
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
