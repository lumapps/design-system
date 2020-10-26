import { TextField } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('Clearable value');

    return <TextField label="Text field label" isClearable value={value} onChange={setValue} theme={theme} />;
};
