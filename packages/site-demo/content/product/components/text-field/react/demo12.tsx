import { useState } from 'react';
import { TextField, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('');
    return <TextField label="Text area label" value={value} onChange={setValue} theme={theme} multiline />;
};
