import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('');

    return <TextField label="Textfield label" value={value} onChange={setValue} theme={theme} type="textarea" />;
};

export default App;
