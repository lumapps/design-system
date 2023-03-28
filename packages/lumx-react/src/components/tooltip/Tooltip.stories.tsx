import { Button, Dialog, Dropdown, Placement, Tooltip } from '@lumx/react';
import React, { useState } from 'react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';

const placements = [Placement.TOP, Placement.BOTTOM, Placement.RIGHT, Placement.LEFT];

export default {
    title: 'LumX components/tooltip/Tooltip',
    component: Tooltip,
    args: Tooltip.defaultProps,
    argTypes: {
        placement: getSelectArgType(placements),
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

/** Display a multiline tooltip */
export const MultilineTooltip = {
    args: {
        ...OnAButton.args,
        label: 'First sentence.\nSecond sentence.\nThird sentence.\n',
    },
};

/** Tooltip should hide when a dropdown opens */
export const TooltipWithDropdown = (props: any) => {
    const [button, setButton] = useState<HTMLElement | null>(null);
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            <Tooltip label={!isOpen && 'Tooltip'} {...props}>
                <Button ref={setButton} onClick={() => setOpen((o) => !o)}>
                    Anchor
                </Button>
            </Tooltip>
            <Dropdown anchorRef={{ current: button }} isOpen={isOpen}>
                Dropdown
            </Dropdown>
        </>
    );
};

/** Tooltip should hide when the anchor is hidden */
export const HideTooltipOnHiddenAnchor = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            The tooltip should show when the button is hovered but it should disappear when the dialog get in-between
            the mouse and the button
            <br />
            <Tooltip label="Tooltip label">
                <Button onClick={() => setOpen((wasOpen) => !wasOpen)}>Open dialog</Button>
            </Tooltip>
            <Dialog isOpen={isOpen} onClose={() => setOpen(false)}>
                Dialog
            </Dialog>
        </>
    );
};
