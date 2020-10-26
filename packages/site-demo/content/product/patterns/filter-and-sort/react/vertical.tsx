import { mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import { Alignment, Button, Chip, ChipGroup, Emphasis, FlexBox, Orientation, Size, TextField } from '@lumx/react';
import React, { useState } from 'react';

const COLORS = ['Red', 'Green', 'Blue'];

const App = () => {
    const [query, setQuery] = useState('');

    return (
        <FlexBox orientation={Orientation.vertical} gap={Size.big} vAlign={Alignment.left} fillSpace>
            <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search"/>

            <ChipGroup>
                {COLORS.map((color, index) => (
                    <Chip key={index} isClickable>
                        {color}
                    </Chip>
                ))}
            </ChipGroup>

            <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                Most relevant
            </Button>
        </FlexBox>
    );
};

export default App;
