import { TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return (
        <TextField
            label="Text field label"
            value={value}
            onChange={setValue}
            placeholder="Placeholder text"
            theme={theme}
        />
    );
};
