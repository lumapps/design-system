import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { ColorPalette, ColorVariant } from '@lumx/core/js/constants';
import { DEFAULT_PROPS } from '.';

/**
 * Setup Link stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific render functions or args can be injected via `overrides`.
 */
export function setup({
    component,
    render,
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                onClick: { action: true },
                typography: { control: 'text' },
            },
            args: {
                ...DEFAULT_PROPS,
                label: 'Link',
            },
        },

        /** Default link */
        Default: {
            args: {
                href: 'https://example.com',
                target: '_blank',
            },
        },

        /** Link as button */
        AsButton: {
            args: {
                label: 'Button Link',
            },
        },

        /** With typography */
        WithTypography: {
            args: {
                href: 'https://example.com',
                typography: 'title',
            },
        },

        /** With color */
        WithColor: {
            args: {
                href: 'https://example.com',
                color: ColorPalette.primary,
                colorVariant: ColorVariant.D1,
            },
        },

        /** Disabled states */
        Disabled: {
            argTypes: {
                isDisabled: { control: false },
                'aria-disabled': { control: false },
            },
            args: {
                label: 'Link',
            },
            decorators: [
                withCombinations({
                    combinations: {
                        sections: {
                            'As link': { href: 'https://example.com' },
                            'As button': {},
                        },
                        rows: {
                            disabled: { isDisabled: true },
                            'aria-disabled': { 'aria-disabled': true },
                        },
                    },
                }),
            ],
        },

        /** All states */
        AllStates: {
            argTypes: {
                isDisabled: { control: false },
            },
            decorators: [
                withCombinations({
                    combinations: {
                        sections: {
                            Default: { href: '#' },
                            'As button': {},
                        },
                        cols: {
                            Default: {},
                            Disabled: { isDisabled: true },
                            'ARIA Disabled': { 'aria-disabled': true },
                        },
                        rows: {
                            Default: {},
                            'color=red': { color: 'red' },
                        },
                    },
                }),
            ],
        },
    };
}
