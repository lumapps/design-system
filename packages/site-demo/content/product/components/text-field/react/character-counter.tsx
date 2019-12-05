import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('Valid value');

    return <TextField label="Textfield label" value={value} onChange={setValue} maxLength={150} theme={theme} />;
};

export default App;
