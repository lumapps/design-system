import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('Valid value');

    return <TextField label="Textfield label" value={value} onChange={setValue} isValid={true} theme={theme} />;
};

export default App;
