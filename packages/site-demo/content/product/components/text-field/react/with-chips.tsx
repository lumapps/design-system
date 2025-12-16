import { Chip, ChipGroup, Size, TextField } from '@lumx/react';
import { useState } from 'react';

export const App = ({ theme }: any) => {
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
