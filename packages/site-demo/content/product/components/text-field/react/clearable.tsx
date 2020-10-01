import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Clearable value');

    return <TextField label="Text field label" isClearable value={value} onChange={setValue} theme={theme} />;
};

export default App;
