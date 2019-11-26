import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }) => {
    const [value, setValue] = useState('');

    return <TextField isClearable value={value} onChange={setValue} theme={theme} />;
};

export default App;
