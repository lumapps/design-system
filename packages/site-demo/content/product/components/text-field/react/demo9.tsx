import { useState } from 'react';
import { TextField, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
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
