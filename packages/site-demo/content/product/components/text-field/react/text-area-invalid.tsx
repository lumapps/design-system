import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('Invalid value');

    return <TextField label="Text area label" value={value} onChange={setValue} hasError theme={theme} multiline />;
};
