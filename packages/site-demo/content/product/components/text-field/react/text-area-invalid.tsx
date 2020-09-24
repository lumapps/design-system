import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Invalid value');

    return (
        <TextField label="Text area label" value={value} onChange={setValue} hasError theme={theme} multiline />
    );
};

export default App;
