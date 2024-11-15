import React from 'react';
import omit from 'lodash/omit';

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
