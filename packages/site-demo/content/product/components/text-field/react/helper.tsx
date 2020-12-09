import { TextField } from '@lumx/react';
import React, { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField label="Text field label" value={value} onChange={setValue} helper="Helper text" theme={theme} />;
};
