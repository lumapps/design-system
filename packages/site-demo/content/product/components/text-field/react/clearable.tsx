import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('Clearable value');

    return <TextField label="Textfield label" isClearable value={value} onChange={setValue} theme={theme} />;
};

export default App;
