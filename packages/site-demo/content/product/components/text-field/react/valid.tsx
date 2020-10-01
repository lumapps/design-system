import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Valid value');

    return <TextField label="Text field label" value={value} onChange={setValue} isValid={true} theme={theme} />;
};

export default App;
