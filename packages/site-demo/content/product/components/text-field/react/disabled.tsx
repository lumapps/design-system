import { TextField } from '@lumx/react';
import { noop } from 'lodash';
import React from 'react';

export const App = ({ theme }: any) => {
    return <TextField label="Textfield label" isDisabled theme={theme} onChange={noop} value="" />;
};
