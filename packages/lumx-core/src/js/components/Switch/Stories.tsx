import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';

import { DEFAULT_PROPS } from '.';

/**
 * Setup Switch stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component: Switch,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component: Switch,
            render: (args: any) => <Switch {...args} />,
            argTypes: {
                onChange: { action: true },
                name: { control: false },
                value: { control: false },
                position: {
                    control: 'select',
                    options: ['left', 'right'],
                },
            },
            args: {
                ...DEFAULT_PROPS,
                isChecked: false,
                name: 'switch-html-name',
                value: 'switch-html-value',
            },
        },

        /** Default switch */
        Default: {},

        /** With label and helper */
        LabelAndHelper: {
            argTypes: {
                label: { control: 'text' },
                helper: { control: 'text' },
            },
            args: {
                label: 'Switch label',
                helper: loremIpsum('tiny'),
            },
        },

        /** With position right */
        PositionRight: {
            argTypes: {
                position: { control: false },
            },
            args: {
                label: 'Switch label',
                position: 'right',
            },
        },

        /** Disabled */
        Disabled: {
            argTypes: {
                isDisabled: { control: false },
                'aria-disabled': { control: false },
            },
            args: {
                label: 'Switch label',
                helper: 'Switch is disabled because...',
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
