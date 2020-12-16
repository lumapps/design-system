import React from 'react';

import { text } from '@storybook/addon-knobs';

import { InputLabel } from './InputLabel';

export default { title: 'LumX components/input-label/Input Label' };

export const SimpleLabel = ({ theme }: any) => (
    <div id="123">
        <InputLabel htmlFor="123" theme={theme}>
            {text('Label', 'The label')}
        </InputLabel>
    </div>
);
