import { useState } from 'react';
import { TextField, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('Valid value');
    return <TextField label="Text area label" value={value} onChange={setValue} isValid theme={theme} multiline />;
};
