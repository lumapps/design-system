import React, { useState } from 'react';

import { mdiMagnify } from '@lumx/icons';
import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('');

    return <TextField value={value} onChange={setValue} icon={mdiMagnify} theme={theme} />;
};

export default App;
