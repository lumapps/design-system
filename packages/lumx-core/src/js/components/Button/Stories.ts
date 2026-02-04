import omit from 'lodash/omit';

import { Emphasis, Size } from '@lumx/core/js/constants';
import { mdiAccountBox } from '@lumx/icons';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { colorArgType } from '@lumx/core/stories/controls/color';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { disableArgTypes } from '@lumx/core/stories/utils/disableArgTypes';

import { ButtonSize } from './ButtonRoot';
import { Button } from './Button';

const buttonSizes = [Size.m, Size.s];
const buttonEmphasis = [Emphasis.high, Emphasis.medium, Emphasis.low];

export const Default = {
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
        linkAs: { table: { disable: true } },
        className: { table: { disable: true } },
        onClick: { action: 'click' },
        target: { if: { arg: 'href', exists: true }, control: { type: 'inline-radio' } },
        type: { if: { arg: 'href', exists: false }, control: { type: 'inline-radio' } },
    },
    args: omit(Button.defaultProps, ['theme']),
};

/**
 * Default button
 */
export const Base = {
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
};

/**
 * Demo button LumX CSS theming variable
 */
export const Theming = {
    args: { children: 'Label' },
    argTypes: {
        ...disableArgTypes(['isDisabled', 'href', 'name', 'type', 'emphasis']),
    },
};
