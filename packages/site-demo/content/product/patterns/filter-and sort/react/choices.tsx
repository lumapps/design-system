import React, { useState } from 'react';

import { mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import { Button, Chip, Emphasis, FlexBox, Orientation, Size, TextField } from '@lumx/react';

const COLORS = ['Red', 'Green', 'Blue'];

const App = () => {
    const [query, setQuery] = useState('');

    return (
        <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap>
            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
                <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

                <FlexBox orientation={Orientation.horizontal} gap={Size.regular} wrap>
                    {COLORS.map((color, index) => (
                        <Chip key={index} isClickable>
                            {color}
                        </Chip>
                    ))}
                </FlexBox>
            </FlexBox>

            <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                Most relevant
            </Button>
        </FlexBox>
    );
};

export default App;
