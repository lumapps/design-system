import { Switch, Alignment } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/switch/Switch' };

export const NotCheckedSwitch = ({ theme }: any) => (
    <Switch isChecked={false} onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const CheckedSwitch = ({ theme }: any) => (
    <Switch isChecked onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);

export const DisabledCheckedSwitch = ({ theme }: any) => {
    const [isChecked, setIsChecked] = React.useState(true);
    return (
        <Switch isChecked={isChecked} isDisabled onChange={() => setIsChecked(isChecked)} theme={theme}>
            {text('text', 'The switch')}
        </Switch>
    );
};

export const DisabledSwitch = ({ theme }: any) => {
    const [isChecked, setIsChecked] = React.useState(false);
    return (
        <Switch isChecked={isChecked} isDisabled onChange={() => setIsChecked(isChecked)} theme={theme}>
            {text('text', 'The switch')}
        </Switch>
    );
};

export const RightPositionSwitch = ({ theme }: any) => (
    <Switch position={Alignment.right} onChange={noop} theme={theme}>
        {text('text', 'The switch')}
    </Switch>
);
