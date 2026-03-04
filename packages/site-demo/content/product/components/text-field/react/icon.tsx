import { useState } from 'react';
import { mdiMagnify } from '@lumx/icons';
import { TextField, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('');
    return <TextField value={value} onChange={setValue} icon={mdiMagnify} theme={theme} />;
};
