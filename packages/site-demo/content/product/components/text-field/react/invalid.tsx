import { TextField } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('Invalid value');

    return <TextField label="Text field label" value={value} onChange={setValue} hasError theme={theme} />;
};
