import React from 'react';

import { mdiClose, mdiViewList } from '@lumx/icons';
import { Chip, ChipProps, ColorPalette, GridColumn, Icon, Size } from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

const chipSizes = [Size.m, Size.s];
export default {
    title: 'LumX components/chip/Chip',
    component: Chip,
    args: Chip.defaultProps,
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
export const Variants = {
    ...WithAfterAndBefore,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'color', options: withUndefined(ColorPalette) },
                cols: { key: 'size', options: chipSizes },
                sections: {
                    Default: {},
                    Disabled: { isDisabled: true },
                    Highlighted: { isHighlighted: true },
                },
            },
        }),
        withWrapper({ maxColumns: 3, itemMinWidth: 350 }, GridColumn),
    ],
};
