import { useState, useRef } from 'react';
import range from 'lodash/range';
import { Button, Dialog, Dropdown, FlexBox, Text } from '@lumx/react';
import { useOverflowTooltipLabel } from '@lumx/react/utils';
import { setup } from '@lumx/core/js/components/Tooltip/TestStories';

import { Tooltip } from '.';

const ToggleTooltip = ({
    getLabel,
    isFunction,
}: {
    getLabel: (isExpanded: boolean) => string;
    isFunction?: boolean;
}) => {
    const [isExpanded, setExpanded] = useState(false);
    return (
        <>
            <Tooltip label={isFunction ? () => getLabel(isExpanded) : getLabel(isExpanded)}>
                <Button onClick={() => setExpanded(!isExpanded)}>Anchor</Button>
            </Tooltip>
            <Button onClick={() => setExpanded(false)}>Collapse</Button>
        </>
    );
};

const OverflowTooltip = ({ text }: { text: string }) => {
    const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
    return (
        <Tooltip label={tooltipLabel}>
            <button type="button" style={{ maxWidth: '100%' }}>
                <Text as="span" truncate ref={labelRef}>
                    {text}
                </Text>
            </button>
        </Tooltip>
    );
};

const { meta, ...testStories } = setup({
    component: Tooltip,
    components: { Button, ToggleTooltip, OverflowTooltip },
});

export default {
    title: 'LumX components/tooltip/Tooltip/Tests',
    ...meta,
};

// Shared test stories from core
export const TestActivateOnHover = { ...testStories.TestActivateOnHover };
export const TestHoverAnchorThenTooltip = { ...testStories.TestHoverAnchorThenTooltip };
export const TestFocusVisibleAndEscape = { ...testStories.TestFocusVisibleAndEscape };
export const TestNoActivateOnClickFocus = { ...testStories.TestNoActivateOnClickFocus };
export const TestCloseModeHide = { ...testStories.TestCloseModeHide };
export const TestAriaDescribedByOnHover = { ...testStories.TestAriaDescribedByOnHover };
export const TestAriaDescribedByOnWrapperHover = { ...testStories.TestAriaDescribedByOnWrapperHover };
export const TestAriaLabelledByOnHover = { ...testStories.TestAriaLabelledByOnHover };
export const TestAriaLabelledByOnWrapperHover = { ...testStories.TestAriaLabelledByOnWrapperHover };
export const TestFunctionLabelFollowsKeyboardToggle = { ...testStories.TestFunctionLabelFollowsKeyboardToggle };
export const TestStringLabelBackAfterKeyboardToggle = { ...testStories.TestStringLabelBackAfterKeyboardToggle };
export const TestFunctionLabelBackAfterKeyboardToggle = { ...testStories.TestFunctionLabelBackAfterKeyboardToggle };
export const TestOverflowLabel = { ...testStories.TestOverflowLabel };
export const TestNoOverflowLabel = { ...testStories.TestNoOverflowLabel };
export const TestOverflowLabelHiddenMount = { ...testStories.TestOverflowLabelHiddenMount };

// React-specific test stories (use React hooks and components not available in Vue)

/** Tooltip should hide when a dropdown opens and should work in a scroll context */
export const TestTooltipWithDropdownAndScroll = (props: any) => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            {range(200).map((i) => (
                <br key={i} />
            ))}
            <FlexBox style={{ position: 'fixed', top: 20 }} orientation="horizontal" gap="big">
                <Tooltip label={!isOpen && 'Tooltip'} {...props} placement="bottom">
                    <Button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
                        Anchor
                    </Button>
                </Tooltip>
                <small>
                    Tooltips should close when attached popover/dropdown opens. <br />
                    It should also keep displaying while scrolling (here on a position: fixed button)
                </small>
            </FlexBox>
            <Dropdown anchorRef={anchorRef} isOpen={isOpen} onClose={() => setOpen(false)}>
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

/** Test focusing a tooltip anchor programmatically */
export const TestProgrammaticFocus = () => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
        <>
            <p>The tooltip should open on keyboard focus but not on programmatic focus (ex: after a click)</p>
            <Tooltip label="label">
                <Button ref={anchorRef}>button with label</Button>
            </Tooltip>
            <Button onClick={() => anchorRef.current?.focus()}>focus the button</Button>
        </>
    );
};
