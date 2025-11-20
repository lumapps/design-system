import { mdiMagnify } from '@lumx/icons';
import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField value={value} onChange={setValue} icon={mdiMagnify} theme={theme} />;
};
