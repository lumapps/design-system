import React, { useState } from 'react';

import { mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import { Button, Chip, ChipGroup, Emphasis, FlexBox, Orientation, Size, TextField } from '@lumx/react';

const COLORS = ['Red', 'Green', 'Blue'];

const App = () => {
    const [query, setQuery] = useState('');

    return (
        <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap>
            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
                <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

                <ChipGroup>
                    {COLORS.map((color, index) => (
                        <Chip key={index} isClickable>
                            {color}
                        </Chip>
                    ))}
                </ChipGroup>
            </FlexBox>

            <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                Most relevant
            </Button>
        </FlexBox>
    );
};

export default App;
