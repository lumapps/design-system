import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField label="Text area label" value={value} onChange={setValue} theme={theme} multiline />;
};
