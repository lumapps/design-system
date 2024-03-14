import React from 'react';
import { Button, ButtonSize, Emphasis, Size, Text } from '@lumx/react';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { colorArgType } from '@lumx/react/stories/controls/color';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { mdiAccountBox } from '@lumx/icons';

const buttonSizes = [Size.m, Size.s];
const buttonEmphasis = [Emphasis.low, Emphasis.medium, Emphasis.high];

export default {
    title: 'LumX components/button/Button',
    component: Button,
    argTypes: {
        isSelected: { control: 'boolean' },
        isDisabled: { control: 'boolean' },
        hasBackground: { control: 'boolean' },
        emphasis: getSelectArgType(buttonEmphasis),
        size: getSelectArgType<ButtonSize>(buttonSizes),
        rightIcon: iconArgType,
        leftIcon: iconArgType,
        color: colorArgType,
        onClick: { action: true },
    },
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
 * Disabled button
 */
export const Disabled = {
    args: {
        isDisabled: true,
        children: 'Default button (disabled)',
    },
};

/**
 * All combinations of size, emphasis and hasBackground
 */
export const SizeEmphasisAndBackground = {
    args: {
        children: 'Button',
    },
    decorators: [
        withCombinations({
            tableStyle: { background: 'lightgray' },
            cellStyle: { padding: '10px' },
            combinations: {
                rows: { medium: { size: Size.m }, small: { size: Size.s } },
                cols: { key: 'emphasis', options: buttonEmphasis },
                sections: {
                    'hasBackground: false': { hasBackground: false },
                    'hasBackground: true': { hasBackground: true },
                },
            },
        }),
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
};

/**
 * Setting a href to transform the button into a link.
 */
export const LinkButtonDisabled = {
    args: {
        href: 'https://example.com',
        children: 'Link button (disabled)',
        isDisabled: true,
    },
};

/**
 * Full width button
 */
export const FullWidth = {
    args: {
        fullWidth: true,
        children: 'Full width button',
    },
};

/**
 * Full width button with long text truncated
 */
export const FullWidthTruncated = {
    argTypes: {
        children: { control: false },
    },
    args: {
        fullWidth: true,
        children: (
            <Text as="span" truncate>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Potenti nullam ac tortor vitae. Lorem ipsum dolor sit amet. Diam sollicitudin
                tempor id eu nisl nunc mi ipsum. Elementum facilisis leo vel fringilla est ullamcorper eget nulla.
                Mollis aliquam ut porttitor leo a diam sollicitudin tempor. Ultrices tincidunt arcu non sodales neque
                sodales.
            </Text>
        ),
    },
};

/**
 * Check button style variations (color, states, emphasis, etc.)
 */
export const ButtonVariations = {
    args: {
        children: 'Button',
        rightIcon: mdiAccountBox,
    },
    decorators: [
        withCombinations({
            tableStyle: { width: '100%' },
            firstColStyle: { whiteSpace: 'nowrap', width: '1%' },
            combinations: {
                // Colors
                rows: {
                    Default: {},
                    'Color: red': { color: 'red' },
                    'Color: green': {color: 'green' },
                },
                // States
                cols: {
                    'Default state': {},
                    Hovered: { isHovered: true },
                    Focused: { isFocused: true },
                    Active: { isActive: true },
                    Disabled: { isDisabled: true },
                },
                // Emphasis/Background
                sections: {
                    'Default (emphasis high)': {},
                    'Emphasis medium': { emphasis: 'medium' },
                    'Emphasis low': { emphasis: 'low' },
                    'Emphasis selected': { emphasis: 'medium', isSelected: true },
                    'Full width': { fullWidth: true },
                    'Has background (emphasis low)': { emphasis: 'low', hasBackground: true },
                    'Has background + Full width': { emphasis: 'low', hasBackground: true, fullWidth: true },
                },
            },
        }),
    ],
};
