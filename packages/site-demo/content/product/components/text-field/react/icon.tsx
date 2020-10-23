import { mdiMagnify } from '@lumx/icons';
import { TextField } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField value={value} onChange={setValue} icon={mdiMagnify} theme={theme}/>;
};

export default App;
