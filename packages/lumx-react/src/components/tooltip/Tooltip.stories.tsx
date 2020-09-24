import { Button, Placement, Switch, Tooltip } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React, { useRef, useState } from 'react';
import { Dropdown } from '../dropdown/Dropdown';

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
    <>
        {'Some text with a '}
        <Tooltip label="A tooltip on the word 'tooltip'">tooltip</Tooltip>
        {' on one word.'}
    </>
);

export const MultilineTooltip = () => (
    <>
        <Tooltip label={'Only one sentence.'}>
            <Button>One line</Button>
        </Tooltip>
        <Tooltip label={'First sentence.\nSecond sentence.\nThird sentence.\n'}>
            <Button>Multiline</Button>
        </Tooltip>
    </>
);

export const EmptyTooltip = () => (
    <>
        <Tooltip label={''}>
            <Button>Empty</Button>
        </Tooltip>
        <Tooltip label={false && 'tooltip'}>
            <Button>Conditionnaly not displayed</Button>
        </Tooltip>
    </>
);

export const TooltipWithDropdown = () => {
    const buttonRef = useRef(null);
    return (
        <>
            <Tooltip label={'Tooltip'}>
                <Button buttonRef={buttonRef}>Anchor</Button>
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
            <Switch checked={disabled} onChange={setDisabled}>
                Toggle button disabled
            </Switch>
            <Tooltip label={'Tooltip on disabled button'}>
                <Button disabled={disabled} onClick={noop}>
                    Click to disable button
                </Button>
            </Tooltip>
        </>
    );
};
