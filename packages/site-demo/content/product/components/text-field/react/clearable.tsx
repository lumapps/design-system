import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('Clearable value');

    return (
        <TextField
            label="Text field label"
            clearButtonProps={{ label: 'Clear' }}
            value={value}
            onChange={setValue}
            theme={theme}
        />
    );
};
