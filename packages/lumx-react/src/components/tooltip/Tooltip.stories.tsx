import { mdiHelp, mdiPrinter } from '@lumx/icons';
import {
    Button,
    Dialog,
    Dropdown,
    FlexBox,
    Icon,
    IconButton,
    Orientation,
    Placement,
    Size,
    Switch,
    Tooltip,
} from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import range from 'lodash/range';
import React, { Fragment, useRef, useState } from 'react';

export default { title: 'LumX components/tooltip/Tooltip' };

export const ForceOpen = () => {
    return (
        <Tooltip
            forceOpen
            placement={select(
                'placement',
                [Placement.TOP, Placement.BOTTOM, Placement.RIGHT, Placement.LEFT],
                Placement.TOP,
            )}
            label={text('label', 'Tooltip label')}
        >
            <Button>Button</Button>
        </Tooltip>
    );
};

export const InlineTooltip = () => (
    <div className="lumx-spacing-margin-huge">
        Some text with a
        <Tooltip label="extremely complex and difficult to follow" forceOpen>
            <abbr style={{ borderBottom: '1px dotted', margin: '0 4px' }}>convoluted</abbr>
        </Tooltip>
        word in it. And some text with a contextual help at the end
        <Tooltip
            label="A contextual help is help that is displayed in your product or web site"
            placement={Placement.TOP}
            forceOpen
        >
            <Icon icon={mdiHelp} size={Size.xxs} style={{ display: 'inline-block', verticalAlign: 'super' }} />
        </Tooltip>
        .
    </div>
);

export const MultilineTooltip = () => (
    <>
        <Tooltip label="Only one sentence.">
            <Button>One line</Button>
        </Tooltip>
        <Tooltip label={'First sentence.\nSecond sentence.\nThird sentence.\n'}>
            <Button>Multiline</Button>
        </Tooltip>
    </>
);

export const EmptyTooltip = () => (
    <>
        <Tooltip label="">
            <Button>Empty</Button>
        </Tooltip>
        <Tooltip label={false}>
            <Button>Conditionnaly not displayed</Button>
        </Tooltip>
    </>
);

export const TooltipWithDropdown = () => {
    const buttonRef = useRef(null);
    return (
        <>
            <Tooltip label="Tooltip">
                <Button ref={buttonRef}>Anchor</Button>
            </Tooltip>
            <Dropdown anchorRef={buttonRef} isOpen>
                Dropdown
            </Dropdown>
        </>
    );
};

export const TooltipOnDisabledButton = () => {
    const [disabled, setDisabled] = useState(false);

    return (
        <>
            <Switch isChecked={disabled} onChange={setDisabled}>
                Toggle button disabled
            </Switch>
            <Tooltip label="Tooltip on disabled button">
                <Button isDisabled={disabled} onClick={noop}>
                    Click to disable button
                </Button>
            </Tooltip>
        </>
    );
};

export const TooltipOnDifferentComponents = () => {
    return (
        <FlexBox orientation={Orientation.horizontal} className="lumx-spacing-margin-top-huge">
            <FlexBox fillSpace />
            <FlexBox fillSpace>
                <Tooltip forceOpen label="Tooltip on Button">
                    <Button>Button</Button>
                </Tooltip>
            </FlexBox>
            <FlexBox fillSpace>
                <IconButton icon={mdiPrinter} label="Tooltip on IconButton" tooltipProps={{ forceOpen: true }} />
            </FlexBox>
            <FlexBox fillSpace>
                <Tooltip forceOpen label="Tooltip on Icon">
                    <Icon icon={mdiPrinter} style={{ display: 'inline-block' }} />
                </Tooltip>
            </FlexBox>
            <FlexBox fillSpace>
                <Tooltip forceOpen label="Tooltip on shaped Icon">
                    <Icon icon={mdiPrinter} hasShape />
                </Tooltip>
            </FlexBox>
            <FlexBox fillSpace>
                <Tooltip forceOpen label="Tooltip on word">
                    <span>word</span>
                </Tooltip>
            </FlexBox>
        </FlexBox>
    );
};

export const HideTooltipOnHiddenAnchor = () => {
    const anchorRef = useRef(null);
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            The tooltip should show when the button is hovered but it should disappear when the popover get in-between
            the mouse and the button
            <br />
            <Tooltip label="Tooltip label">
                <Button ref={anchorRef} onClick={() => setOpen((wasOpen) => !wasOpen)}>
                    Open popover
                </Button>
            </Tooltip>
            <Dialog isOpen={isOpen} onClose={() => setOpen(false)}>
                Dialog
            </Dialog>
        </>
    );
};

export const StressTest = () => {
    return range(1000).map((i) => (
        <Fragment key={i}>
            <Tooltip label={`Label ${i}`}>
                <Button>Button {i}</Button>
            </Tooltip>
            <br />
        </Fragment>
    ));
};
