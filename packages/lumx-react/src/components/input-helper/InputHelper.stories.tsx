import { InputHelper, Kind } from '@lumx/react';
import { text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Input Helper' };

export const informationHelper = ({ theme }) => (
    <InputHelper kind={Kind.info} theme={theme}>
        {text('Text', 'ex: toto@acme.com')}
    </InputHelper>
);

export const errorHelper = ({ theme }) => (
    <InputHelper kind={Kind.error} theme={theme}>
        {text('Text', 'You should be bold!')}
    </InputHelper>
);

export const validHelper = ({ theme }) => (
    <InputHelper kind={Kind.valid} theme={theme}>
        {text('Text', 'Great, you are bold')}
    </InputHelper>
);

export const warningHelper = ({ theme }) => (
    <InputHelper kind={Kind.warning} theme={theme}>
        {text('Text', 'This should be used carefuly')}
    </InputHelper>
);
