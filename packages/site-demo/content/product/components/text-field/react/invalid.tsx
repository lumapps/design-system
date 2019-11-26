import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('Invalid value');

    return <TextField label="Textfield label" value={value} onChange={setValue} hasError={true} theme={theme} />;
};

export default App;
