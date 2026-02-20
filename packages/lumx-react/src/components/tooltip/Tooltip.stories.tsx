import { Button, Placement, Tooltip } from '@lumx/react';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';
import { ARIA_LINK_MODES } from '@lumx/react/components/tooltip/constants';

const placements = [Placement.TOP, Placement.BOTTOM, Placement.RIGHT, Placement.LEFT];
const CLOSE_MODES = ['hide', 'unmount'];

export default {
    title: 'LumX components/tooltip/Tooltip',
    component: Tooltip,
    args: Tooltip.defaultProps,
    argTypes: {
        placement: getSelectArgType(placements),
        children: { control: false },
        closeMode: { control: { type: 'inline-radio' }, options: CLOSE_MODES },
        ariaLinkMode: { control: { type: 'inline-radio' }, options: ARIA_LINK_MODES },
    },
    decorators: [
        // Force minimum chromatic screen size to make sure the dialog appears in view.
        withChromaticForceScreenSize(),
    ],
};

/** Simple tooltip on a button*/
export const OnAButton = {
    args: {
        label: 'Tooltip label',
        children: <Button>Button</Button>,
    },
};

/** Simple tooltip on a button*/
export const OnADisabledButton = {
    args: {
        ...OnAButton.args,
        children: <Button isDisabled>Button</Button>,
    },
};

/** Forcing the tooltip to appear */
export const ForceOpen = {
    args: {
        ...OnAButton.args,
        forceOpen: true,
    },
};

/** Hide on close instead of unmounting */
export const CloseModeHide = {
    args: {
        ...OnAButton.args,
        closeMode: 'hide',
    },
};

/** Display a multiline tooltip */
export const MultilineTooltip = {
    args: {
        ...OnAButton.args,
        label: 'First sentence.\nSecond sentence.\nThird sentence.\n',
    },
};
