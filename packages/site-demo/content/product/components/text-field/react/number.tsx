import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField label="Number" value={value} type="number" onChange={setValue} theme={theme} />;
};
