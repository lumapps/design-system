import React from 'react';

import omit from 'lodash/omit';
import { mdiClose, mdiViewList } from '@lumx/icons';
import { Chip, ChipProps, ColorPalette, Icon, Size, Theme } from '@lumx/react';

import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withTheming } from '@lumx/react/stories/utils/theming';
import { DESIGN_TOKENS } from '@lumx/core/src/js/constants/design-tokens';
import pick from 'lodash/pick';
import { withThemedBackground } from '@lumx/react/stories/decorators/withThemedBackground';

const chipSizes = [Size.m, Size.s];
export default {
    title: 'LumX components/chip/Chip',
    component: Chip,
    args: omit(Chip.defaultProps, ['theme']),
    argTypes: {
        size: getSelectArgType<ChipProps['size']>(chipSizes),
        before: { control: false },
        after: { control: false },
    },
};

/**
 * Default chip with label
 */
export const Default = {
    args: { children: 'Chip label' },
};

/**
 * Clickable chip
 */
export const ChipButton = {
    args: { children: 'Chip label' },
    argTypes: { onClick: { action: true } },
};

/**
 * Link chip
 */
export const ChipLink = {
    args: {
        children: 'Chip link',
        href: 'https://example.com',
        target: '_blank',
    },
};

/**
 * With custom elements at the start and end of the chip
 */
export const WithAfterAndBefore = {
    argTypes: {
        onBeforeClick: { action: true },
        onClick: { action: true },
        onAfterClick: { action: true },
    },
    args: {
        before: <Icon icon={mdiViewList} />,
        children: 'Chip label',
        after: <Icon icon={mdiClose} />,
    },
};

/**
 * All combinations of color, size and states.
 */
export const SelectedVariants = {
    ...WithAfterAndBefore,
    decorators: [
        withThemedBackground(),
        withCombinations({
            combinations: {
                sections: { key: 'size', options: chipSizes },
                rows: {
                    'theme=light': { theme: Theme.light },
                    'Selected & theme=light': { isSelected: true, theme: Theme.light },
                    'theme=dark': { theme: Theme.dark },
                    'Selected & theme=dark': { isSelected: true, theme: Theme.dark },
                },
                cols: {
                    Default: {},
                    Hover: { 'data-lumx-hover': true },
                    Active: { 'data-lumx-active': true },
                    Disabled: { isDisabled: true },
                    Focused: { 'data-focus-visible-added': true },
                },
            },
        }),
    ],
};

/**
 * All combinations of color, size and states.
 */
export const ColorVariants = {
    ...WithAfterAndBefore,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'color', options: withUndefined(ColorPalette) },
                sections: { key: 'size', options: chipSizes },
                cols: {
                    Default: {},
                    Hover: { 'data-lumx-hover': true },
                    Active: { 'data-lumx-active': true },
                    Disabled: { isDisabled: true },
                    Focused: { 'data-focus-visible-added': true },
                },
            },
        }),
    ],
};

/**
 * Test chip CSS variable theming
 */
export const Theming = {
    ...ChipButton,
    decorators: [
        withThemedBackground(),
        withCombinations({
            combinations: {
                sections: { 'Size s': { size: 's' }, 'Size m': { size: 'm' } },
                rows: {
                    Default: {},
                    'theme=dark': { theme: Theme.dark },
                    Selected: { isSelected: true },
                    'Selected & theme=dark': { isSelected: true, theme: Theme.dark },
                },
                // States
                cols: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    Focused: { 'data-focus-visible-added': true },
                    Active: { 'data-lumx-active': true },
                    Hover: { 'data-lumx-hover': true },
                },
            },
        }),
        withTheming({
            properties: pick(DESIGN_TOKENS, ['chip']),
            values: `
            --lumx-chip-emphasis-selected-state-default-border-width: 2px;
            --lumx-chip-emphasis-selected-state-default-theme-light-border-color: red;
            --lumx-chip-emphasis-selected-state-default-theme-dark-border-color: blue;

            --lumx-chip-emphasis-selected-state-hover-border-width: 3px;
            --lumx-chip-emphasis-selected-state-hover-theme-light-border-color: green;
            --lumx-chip-emphasis-selected-state-hover-theme-dark-border-color: violet;

            --lumx-chip-emphasis-selected-state-active-border-width: 4px;
            --lumx-chip-emphasis-selected-state-active-theme-light-border-color: orange;
            --lumx-chip-emphasis-selected-state-active-theme-dark-border-color: pink;
            `,
        }),
    ],
};
