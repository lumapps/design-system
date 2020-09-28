import { Switch, SwitchPosition } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/switch/Switch' };

export const notCheckedSwitch = ({ theme }: any) => (
    <Switch isChecked={false} onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const checkedSwitch = ({ theme }: any) => (
    <Switch isChecked onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledCheckedSwitch = ({ theme }: any) => (
    <Switch isChecked isDisabled onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const disabledSwitch = ({ theme }: any) => (
    <Switch isDisabled onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const leftPositionSwitch = ({ theme }: any) => (
    <Switch position={SwitchPosition.right} onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);
