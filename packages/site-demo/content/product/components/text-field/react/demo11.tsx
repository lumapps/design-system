import { useState } from 'react';
import { Chip, ChipGroup, TextField, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const [value, setValue] = useState('');
    return (
        <TextField
            value={value}
            onChange={setValue}
            theme={theme}
            chips={
                <ChipGroup>
                    <Chip size="s">First</Chip>
                    <Chip size="s">Second</Chip>
                    <Chip size="s">Third</Chip>
                </ChipGroup>
            }
        />
    );
};
