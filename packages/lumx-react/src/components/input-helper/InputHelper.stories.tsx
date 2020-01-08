import { InputHelper, Kind } from '@lumx/react';
import { decorators } from '@lumx/react/story-block';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Input Helper', decorators };

export const simpleHelper = ({ theme }) => (
    <InputHelper kind={select('Kind', Kind, Kind.info)} theme={theme} text={text('Helper Text', 'ex: toto@acme.com')} />
);
