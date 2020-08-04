import { RadioButton } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import noop from 'lodash/noop';
import React from 'react';

export default { title: 'LumX components/radio-button/Radio button' };

export const simpleRadioButton = ({ theme }: any) => (
    <RadioButton
        checked={false}
        label={text('Label', 'Radio button')}
        name="test1"
        theme={theme}
        value="lorem"
        onChange={noop}
    />
);

export const simpleCheckedRadioButton = ({ theme }: any) => (
    <RadioButton
        checked={true}
        label={text('Label', 'Radio button')}
        name="test1"
        theme={theme}
        value="lorem"
        onChange={noop}
    />
);
