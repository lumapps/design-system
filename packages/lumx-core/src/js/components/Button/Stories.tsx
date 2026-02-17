import { Emphasis, Size, Theme } from '@lumx/core/js/constants';
import { mdiAccountBox } from '@lumx/icons';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

import { ButtonSize } from './ButtonRoot';
import { DEFAULT_PROPS } from './Button';

const buttonSizes = [Size.m, Size.s];
const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];

// Combination of props that should be avoided
export const excludeCombination = ({ isSelected, emphasis, hasBackground }: any) => {
    // isSelected is only supported in medium emphasis
    if (isSelected && emphasis && emphasis !== Emphasis.medium && emphasis !== Emphasis.low) return true;
    // hasBackground is only supported in low emphasis
    if (hasBackground && emphasis && emphasis !== Emphasis.low) return true;
    return false;
};

/**
 * Setup Button stories for a specific framework (React or Vue).
 * This function creates all the stories with the appropriate decorators.
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: Button,
    decorators: { withCombinations, withThemedBackground },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withThemedBackground';
}>) {
    return {
        meta: {
            component: Button,
            render: ({ children, ...args }: any) => <Button {...args}>{children}</Button>,
            argTypes: {
                isSelected: { control: 'boolean', if: { arg: 'emphasis', eq: 'medium' } },
                isDisabled: { control: 'boolean' },
                hasBackground: { control: 'boolean', if: { arg: 'emphasis', eq: 'low' } },
                emphasis: getSelectArgType(buttonEmphasis),
                size: getSelectArgType<ButtonSize>(buttonSizes),
                rightIcon: iconArgType,
                leftIcon: iconArgType,
                color: colorArgType,
                ref: { table: { disable: true } },
                onClick: { action: true, table: { disable: true } },
                linkAs: { table: { disable: true } },
                className: { table: { disable: true } },
                target: { if: { arg: 'href', exists: true }, control: { type: 'inline-radio' } },
                type: { if: { arg: 'href', exists: false }, control: { type: 'inline-radio' } },
            },
            args: {
                ...DEFAULT_PROPS,
                children: 'Label',
            },
        },

        /** Default button */
        Base: {
            args: {
                children: 'Default button',
            },
        },

        /** All combinations of size and emphasis */
        SizeAndEmphasis: {
            args: {
                children: 'Button',
            },
            argTypes: {
                // Disable props that are used in the combinations
                ...disableArgTypes(['emphasis', 'size']),
            },
            decorators: [
                withThemedBackground(),
                withCombinations({
                    cellStyle: { padding: '10px' },
                    combinations: {
                        sections: { key: 'theme', options: Object.values(Theme) },
                        rows: { medium: { size: Size.m }, small: { size: Size.s } },
                        cols: { key: 'emphasis', options: buttonEmphasis },
                    },
                }),
            ],
        },

        /** Setting a href to transform the button into a link. */
        LinkButton: {
            args: {
                href: 'https://example.com',
                children: 'Link button',
            },
            decorators: [
                withCombinations({
                    combinations: {
                        cols: {
                            Default: {},
                            Disabled: { isDisabled: true },
                            AriaDisabled: { 'aria-disabled': true },
                        },
                    },
                }),
            ],
        },

        /** Check button style variations (color, states, emphasis, etc.) */
        StateVariations: {
            args: {
                children: 'Button',
                rightIcon: mdiAccountBox,
            },
            argTypes: {
                ...disableArgTypes([
                    'emphasis',
                    'hasBackground',
                    'isSelected',
                    'isDisabled',
                    'color',
                    'fullWidth',
                    'type',
                    'name',
                    'href',
                ]),
            },
            decorators: [
                withThemedBackground(),
                withCombinations({
                    tableStyle: { width: '100%' },
                    firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
                    excludeCombination,
                    combinations: {
                        // Colors
                        rows: {
                            Default: {},
                            'Color: red': { color: 'red' },
                            'Theme: dark': { theme: 'dark' },
                            'Theme: dark & color: green': { theme: 'dark', color: 'green' },
                            Selected: { isSelected: true },
                            'Selected & theme dark': { isSelected: true, theme: 'dark' },
                        },
                        // States
                        cols: {
                            'Default state': {},
                            Hovered: { isHovered: true },
                            Active: { isActive: true },
                            Focused: { isFocused: true },
                            Disabled: { isDisabled: true },
                            AriaDisabled: { 'aria-disabled': true },
                        },
                        // Emphasis/Background
                        sections: {
                            'Default (emphasis high)': {},
                            'Emphasis medium': { emphasis: 'medium' },
                            'Emphasis low': { emphasis: 'low' },
                            'Full width': { fullWidth: true },
                            'Emphasis low + has background': { emphasis: 'low', hasBackground: true },
                        },
                    },
                }),
            ],
        },
    };
}
