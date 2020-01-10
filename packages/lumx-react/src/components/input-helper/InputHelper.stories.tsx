import { InputHelper, Kind } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Input Helper', decorators };

export const informationHelper = ({ theme }) => (
    <InputHelper kind={Kind.info} theme={theme} text={text('Text', 'ex: toto@acme.com')} />
);

export const errorHelper = ({ theme }) => (
    <InputHelper kind={Kind.error} theme={theme} text={text('Text', 'You should be bold!')} />
);

export const validHelper = ({ theme }) => (
    <InputHelper kind={Kind.valid} theme={theme} text={text('Text', 'Great, you are bold')} />
);

export const warningHelper = ({ theme }) => (
    <InputHelper kind={Kind.warning} theme={theme} text={text('Text', 'This should be used carefuly')} />
);
