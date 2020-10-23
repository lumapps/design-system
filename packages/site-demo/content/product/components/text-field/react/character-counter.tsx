import { TextField } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField label="Text field label" value={value} onChange={setValue} maxLength={50} theme={theme}/>;
};

export default App;
