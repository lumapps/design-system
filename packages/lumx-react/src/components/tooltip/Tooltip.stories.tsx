import { Button, Placement, Tooltip } from '@lumx/react';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

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
        <Tooltip label="A tooltip on the word 'tooltip'">
            <u>tooltip</u>
        </Tooltip>
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
