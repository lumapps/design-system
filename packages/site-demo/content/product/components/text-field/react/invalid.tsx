import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('Invalid value');

    return <TextField label="Text field label" value={value} onChange={setValue} hasError={true} theme={theme} />;
};

export default App;
