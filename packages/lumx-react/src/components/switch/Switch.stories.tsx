import { Switch, SwitchPosition } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'Switch' };

export const NotCheckedSwitch = ({ theme }: any) => (
    <Switch checked={false} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const CheckedSwitch = ({ theme }: any) => (
    <Switch checked onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const DisabledCheckedSwitch = ({ theme }: any) => (
    <Switch checked disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const DisabledSwitch = ({ theme }: any) => (
    <Switch disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const LeftPositionSwitch = ({ theme }: any) => (
    <Switch position={SwitchPosition.right} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);
