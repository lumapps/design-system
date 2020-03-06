import { RadioButton } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'Radio button' };

export const SimpleRadioButton = ({ theme }: any) => (
    <RadioButton
        checked={false}
        label={text('Label', 'Radio button')}
        name="test1"
        theme={theme}
        value="lorem"
        onChange={noop}
    />
);

export const SimpleCheckedRadioButton = ({ theme }: any) => (
    <RadioButton
        checked
        label={text('Label', 'Radio button')}
        name="test1"
        theme={theme}
        value="lorem"
        onChange={noop}
    />
);
