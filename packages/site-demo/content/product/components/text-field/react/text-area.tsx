import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return <TextField label="Textfield label" value={value} onChange={setValue} theme={theme} multiline />;
};

export default App;
