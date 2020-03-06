import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Valid value');

    return <TextField label="Textfield label" value={value} onChange={setValue} isValid theme={theme} />;
};

export default App;
