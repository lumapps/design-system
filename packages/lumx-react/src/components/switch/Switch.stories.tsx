import { Switch, SwitchPosition } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/Switch' };

export const notCheckedSwitch = ({ theme }: any) => (
    <Switch checked={false} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const checkedSwitch = ({ theme }: any) => (
    <Switch checked onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledCheckedSwitch = ({ theme }: any) => (
    <Switch checked disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledSwitch = ({ theme }: any) => (
    <Switch disabled onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const leftPositionSwitch = ({ theme }: any) => (
    <Switch position={SwitchPosition.right} onToggle={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);
