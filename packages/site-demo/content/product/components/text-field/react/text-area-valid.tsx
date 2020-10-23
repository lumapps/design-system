import { TextField } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Valid value');

    return <TextField label="Text area label" value={value} onChange={setValue} isValid theme={theme} multiline/>;
};

export default App;
