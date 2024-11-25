import React from 'react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';

import { Button, ButtonSize, Emphasis, GridColumn, Size, Text, Theme } from '@lumx/react';
import { mdiAccountBox } from '@lumx/icons';

import { iconArgType } from '@lumx/react/stories/controls/icons';
import { colorArgType } from '@lumx/react/stories/controls/color';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { disableArgTypes } from '@lumx/react/stories/utils/disableArgTypes';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';
import { withTheming } from '@lumx/react/stories/utils/theming';
import { DESIGN_TOKENS } from '@lumx/core/js/constants/design-tokens';

const buttonSizes = [Size.m, Size.s];
const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];

// Combination of props that should be avoided
const excludeCombination = ({ isSelected, emphasis, hasBackground }: any) => {
    // isSelected is only supported in medium emphasis
    if (isSelected && emphasis && emphasis !== 'medium') return true;
    // hasBackground is only supported in low emphasis
    if (hasBackground && emphasis && emphasis !== 'low') return true;
    return false;
};

export default {
    title: 'LumX components/button/Button',
    component: Button,
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
    args: omit(Button.defaultProps, ['theme']),
};

/**
 * Default button
 */
export const Default = {
    args: {
        children: 'Default button',
    },
};

/**
 * All combinations of size and emphasis
 */
export const SizeAndEmphasis = {
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
        withWrapper({ maxColumns: 3, itemMinWidth: 350 }, GridColumn),
    ],
};

/**
 * Setting a href to transform the button into a link.
 */
export const LinkButton = {
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
                },
            },
        }),
    ],
};

/**
 * Demo content sizing
 */
export const ContentSizing = {
    decorators: [
        withCombinations({
            colStyle: { width: '50%' },
            cellStyle: { maxWidth: '400px', overflow: 'hidden' },
            combinations: {
                rows: {
                    Default: {},
                    FullWidth: { fullWidth: true },
                },
                cols: {
                    'Short text': {
                        children: 'Short text',
                    },
                    'Long text': {
                        children: (
                            <Text as="span" truncate>
                                {loremIpsum('long')}
                            </Text>
                        ),
                    },
                },
            },
        }),
    ],
};

/**
 * Check button style variations (color, states, emphasis, etc.)
 */
export const StateVariations = {
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
};

/**
 * Demo button LumX CSS theming variable
 */
export const Theming = {
    args: { children: 'Label' },
    argTypes: {
        ...disableArgTypes(['isDisabled', 'href', 'name', 'type', 'emphasis']),
    },
    decorators: [
        withThemedBackground(),
        withCombinations({
            excludeCombination,
            combinations: {
                // States
                cols: {
                    Default: {},
                    Hovered: { isHovered: true },
                    Active: { isActive: true },
                    Focused: { isFocused: true },
                    Disabled: { isDisabled: true },
                },
                rows: {
                    Default: {},
                    Selected: { isSelected: true },
                    'Has background': { hasBackground: true },
                },
            },
        }),
        withTheming({
            properties: pick(DESIGN_TOKENS, ['button']),
            values: `
            --lumx-button-height: 50px;
            --lumx-button-border-radius: 2px;

            /////////////
            --lumx-button-emphasis-high-state-default-padding-horizontal: 10px;
            --lumx-button-emphasis-high-state-default-border-width: 2px;
            --lumx-button-emphasis-high-state-hover-padding-horizontal: 15px;
            --lumx-button-emphasis-high-state-hover-border-width: 4px;
            --lumx-button-emphasis-high-state-active-padding-horizontal: 20px;
            --lumx-button-emphasis-high-state-active-border-width: 6px;

            --lumx-button-emphasis-high-state-default-theme-light-background-color: darkred;
            --lumx-button-emphasis-high-state-default-theme-light-color: green;
            --lumx-button-emphasis-high-state-default-theme-light-border-color: green;
            --lumx-button-emphasis-high-state-hover-theme-light-background-color: rebeccapurple;
            --lumx-button-emphasis-high-state-hover-theme-light-color: yellow;
            --lumx-button-emphasis-high-state-hover-theme-light-border-color: yellow;
            --lumx-button-emphasis-high-state-active-theme-light-background-color: black;
            --lumx-button-emphasis-high-state-active-theme-light-color: blue;
            --lumx-button-emphasis-high-state-active-theme-light-border-color: blue;

            --lumx-button-emphasis-high-state-default-theme-dark-background-color: rebeccapurple;
            --lumx-button-emphasis-high-state-default-theme-dark-color: hotpink;
            --lumx-button-emphasis-high-state-default-theme-dark-border-color: hotpink;
            --lumx-button-emphasis-high-state-hover-theme-dark-background-color: yellow;
            --lumx-button-emphasis-high-state-hover-theme-dark-color: blue;
            --lumx-button-emphasis-high-state-hover-theme-dark-border-color: blue;
            --lumx-button-emphasis-high-state-active-theme-dark-background-color: green;
            --lumx-button-emphasis-high-state-active-theme-dark-color: red;
            --lumx-button-emphasis-high-state-active-theme-dark-border-color: red;

            /////////////
            --lumx-button-emphasis-medium-state-default-padding-horizontal: 5px;
            --lumx-button-emphasis-medium-state-default-border-width: 6px;
            --lumx-button-emphasis-medium-state-hover-padding-horizontal: 10px;
            --lumx-button-emphasis-medium-state-hover-border-width: 4px;
            --lumx-button-emphasis-medium-state-active-padding-horizontal: 2px;
            --lumx-button-emphasis-medium-state-active-border-width: 2px;

            --lumx-button-emphasis-medium-state-default-theme-light-background-color: lightblue;
            --lumx-button-emphasis-medium-state-default-theme-light-color: hotpink;
            --lumx-button-emphasis-medium-state-default-theme-light-border-color: hotpink;
            --lumx-button-emphasis-medium-state-hover-theme-light-background-color: red;
            --lumx-button-emphasis-medium-state-hover-theme-light-color: rebeccapurple;
            --lumx-button-emphasis-medium-state-hover-theme-light-border-color: rebeccapurple;
            --lumx-button-emphasis-medium-state-active-theme-light-background-color: lightseagreen;
            --lumx-button-emphasis-medium-state-active-theme-light-color: maroon;
            --lumx-button-emphasis-medium-state-active-theme-light-border-color: maroon;

            --lumx-button-emphasis-medium-state-default-theme-dark-background-color: mediumorchid;
            --lumx-button-emphasis-medium-state-default-theme-dark-color: midnightblue;
            --lumx-button-emphasis-medium-state-default-theme-dark-border-color: midnightblue;
            --lumx-button-emphasis-medium-state-hover-theme-dark-background-color: olive;
            --lumx-button-emphasis-medium-state-hover-theme-dark-color: orangered;
            --lumx-button-emphasis-medium-state-hover-theme-dark-border-color: orangered;
            --lumx-button-emphasis-medium-state-active-theme-dark-background-color: salmon;
            --lumx-button-emphasis-medium-state-active-theme-dark-color: seagreen;
            --lumx-button-emphasis-medium-state-active-theme-dark-border-color: seagreen;

            /////////////
            --lumx-button-emphasis-selected-state-default-padding-horizontal: 5px;
            --lumx-button-emphasis-selected-state-default-border-width: 1px;
            --lumx-button-emphasis-selected-state-hover-padding-horizontal: 2px;
            --lumx-button-emphasis-selected-state-hover-border-width: 2px;
            --lumx-button-emphasis-selected-state-active-padding-horizontal: 10px;
            --lumx-button-emphasis-selected-state-active-border-width: 3px;

            --lumx-button-emphasis-selected-state-default-theme-light-background-color: yellowgreen;
            --lumx-button-emphasis-selected-state-default-theme-light-color: bisque;
            --lumx-button-emphasis-selected-state-default-theme-light-border-color: bisque;
            --lumx-button-emphasis-selected-state-hover-theme-light-background-color: cadetblue;
            --lumx-button-emphasis-selected-state-hover-theme-light-color: coral;
            --lumx-button-emphasis-selected-state-hover-theme-light-border-color: coral;
            --lumx-button-emphasis-selected-state-active-theme-light-background-color: darkgoldenrod;
            --lumx-button-emphasis-selected-state-active-theme-light-color: darkslategrey;
            --lumx-button-emphasis-selected-state-active-theme-light-border-color: darkslategrey;

            --lumx-button-emphasis-selected-state-default-theme-dark-background-color: gold;
            --lumx-button-emphasis-selected-state-default-theme-dark-color: ghostwhite;
            --lumx-button-emphasis-selected-state-default-theme-dark-border-color: ghostwhite;
            --lumx-button-emphasis-selected-state-hover-theme-dark-background-color: lightcoral;
            --lumx-button-emphasis-selected-state-hover-theme-dark-color: magenta;
            --lumx-button-emphasis-selected-state-hover-theme-dark-border-color: magenta;
            --lumx-button-emphasis-selected-state-active-theme-dark-background-color: mediumslateblue;
            --lumx-button-emphasis-selected-state-active-theme-dark-color: mistyrose;
            --lumx-button-emphasis-selected-state-active-theme-dark-border-color: mistyrose;

            /////////////
            --lumx-button-emphasis-low-state-default-padding-horizontal: 1px;
            --lumx-button-emphasis-low-state-default-border-width: 10px;
            --lumx-button-emphasis-low-state-hover-padding-horizontal: 2px;
            --lumx-button-emphasis-low-state-hover-border-width: 5px;
            --lumx-button-emphasis-low-state-active-padding-horizontal: 3px;
            --lumx-button-emphasis-low-state-active-border-width: 2px;

            --lumx-button-emphasis-low-state-default-theme-light-background-color: rgb(from lightcyan r g b / 50%);
            --lumx-button-emphasis-low-state-default-theme-light-color: rgb(from goldenrod r g b / 50%);
            --lumx-button-emphasis-low-state-default-theme-light-border-color: rgb(from goldenrod r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-light-background-color: rgb(from darkslategray r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-light-color: rgb(from crimson r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-light-border-color: rgb(from crimson r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-light-background-color: rgb(from blanchedalmond r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-light-color: rgb(from firebrick r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-light-border-color: rgb(from firebrick r g b / 50%);

            --lumx-button-emphasis-low-state-default-theme-dark-background-color: rgb(from blueviolet r g b / 50%);
            --lumx-button-emphasis-low-state-default-theme-dark-color: rgb(from chartreuse r g b / 50%);
            --lumx-button-emphasis-low-state-default-theme-dark-border-color: rgb(from chartreuse r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-dark-background-color: rgb(from darkturquoise r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-dark-color: rgb(from goldenrod r g b / 50%);
            --lumx-button-emphasis-low-state-hover-theme-dark-border-color: rgb(from goldenrod r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-dark-background-color: rgb(from magenta r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-dark-color: rgb(from lightsteelblue r g b / 50%);
            --lumx-button-emphasis-low-state-active-theme-dark-border-color: rgb(from lightsteelblue r g b / 50%);
        `,
        }),
        withCombinations({
            combinations: {
                sections: { key: 'emphasis', options: buttonEmphasis },
            },
        }),
        withCombinations({
            combinations: {
                sections: { 'Theme light': { theme: 'light' }, 'Theme dark': { theme: 'dark' } },
            },
        }),
    ],
};
