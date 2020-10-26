import { Select } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => (
    <Select isDisabled value="" label="Select label" placeholder="Select a value" theme={theme} />
);
