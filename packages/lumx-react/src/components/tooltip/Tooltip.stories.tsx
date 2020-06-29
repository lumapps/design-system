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
