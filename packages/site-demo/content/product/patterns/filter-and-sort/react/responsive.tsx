import { mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import { Alignment, Button, Chip, ChipGroup, Emphasis, FlexBox, Icon, Orientation, Size, TextField } from '@lumx/react';
import { useState } from 'react';

const COLORS = ['Red', 'Green', 'Blue'];

export const App = () => {
    const [query, setQuery] = useState('');

    return (
        <FlexBox orientation={Orientation.horizontal} gap={Size.huge} hAlign={Alignment.top}>
            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
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

            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap style={{ width: 250 }}>
                <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
                    <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

                    <ChipGroup>
                        {COLORS.map((color, index) => (
                            <Chip key={index} after={<Icon icon={mdiMenuDown} size={Size.xs} />} isClickable>
                                {color}
                            </Chip>
                        ))}
                    </ChipGroup>
                </FlexBox>

                <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                    Most relevant
                </Button>
            </FlexBox>
        </FlexBox>
    );
};
