import { Chip, ChipGroup, Size, TextField } from '@lumx/react';
import React, { useState } from 'react';

const App = ({ theme }: any) => {
    const [value, setValue] = useState('');

    return (
        <TextField
            value={value}
            onChange={setValue}
            theme={theme}
            chips={
                <ChipGroup>
                    <Chip size={Size.s}>First</Chip>
                    <Chip size={Size.s}>Second</Chip>
                    <Chip size={Size.s}>Third</Chip>
                </ChipGroup>
            }
        />
    );
};

export default App;
