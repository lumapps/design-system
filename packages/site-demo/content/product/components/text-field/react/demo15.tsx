import { useState } from 'react';
import { TextField, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('');
    return <TextField label="Number" value={value} type="number" onChange={setValue} theme={theme} />;
};
