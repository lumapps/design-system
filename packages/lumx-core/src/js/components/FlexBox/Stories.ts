import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';

import { Orientation } from '../../constants';
import { GAP_SIZES, HORIZONTAL_ALIGNMENTS, VERTICAL_ALIGNMENTS } from './constants';

export const Default = {
    argTypes: {
        orientation: getSelectArgType(Orientation),
        fillSpace: { control: 'boolean' },
        wrap: { control: 'boolean' },
        noShrink: { control: 'boolean' },
        hAlign: getSelectArgType(VERTICAL_ALIGNMENTS),
        vAlign: getSelectArgType(HORIZONTAL_ALIGNMENTS),
        gap: getSelectArgType(GAP_SIZES),
    },
};

/**
 * Without config, FlexBox acts as a simple <div>
 */
export const NoConfig = {
    args: {
        style: { width: '100%', height: '100%' },
    },
};

/**
 * Horizontal orientation with all possible item alignments
 */
export const Horizontal = {
    ...NoConfig,
    args: {
        ...NoConfig.args,
        orientation: Orientation.horizontal,
    },
};

/**
 * Vertical orientation with all possible item alignments
 */
export const Vertical = {
    ...NoConfig,
    args: {
        ...NoConfig.args,
        orientation: Orientation.vertical,
    },
};

/**
 * All gap sizes
 */
export const GapSizes = {
    ...Horizontal,
    argTypes: {
        gap: { control: false },
    },
};

/**
 * Wrap items in new row or column
 */
export const Wrap = {
    args: {
        ...NoConfig.args,
        orientation: Orientation.horizontal,
        wrap: true,
    },
    argTypes: {
        wrap: { control: false },
    },
};

/**
 * Prevent FlexBox from shrinking into a parent flex box
 */
export const NoShrink = {
    args: {
        noShrink: true,
    },
};

/**
 * All combinations of margin auto values
 */
export const MarginAuto = {};
