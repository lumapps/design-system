import React, { useState } from 'react';

import { TextField } from '@lumx/react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return (
        <TextField
            label="Text field label"
            value={value}
            onChange={setValue}
            placeholder={'Placeholder text'}
            theme={theme}
        />
    );
};

export default App;
