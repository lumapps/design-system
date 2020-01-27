import { Switch, SwitchPosition } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'Switch' };

export const notCheckedSwitch = ({ theme }) => (
    <Switch checked={false} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const checkedSwitch = ({ theme }) => (
    <Switch checked onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledCheckedSwitch = ({ theme }) => (
    <Switch checked disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledSwitch = ({ theme }) => (
    <Switch disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const leftPositionSwitch = ({ theme }) => (
    <Switch position={SwitchPosition.right} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);
