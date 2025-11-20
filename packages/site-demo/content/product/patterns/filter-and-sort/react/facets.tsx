import { mdiMagnify, mdiMenuDown, mdiSort } from '@lumx/icons';
import {
    Button,
    Chip,
    ChipGroup,
    Emphasis,
    FlexBox,
    Icon,
    List,
    ListItem,
    Orientation,
    Select,
    SelectVariant,
    Size,
    TextField,
} from '@lumx/react';
import { useState } from 'react';

const COLORS = ['Red', 'Green', 'Blue'];

export const App = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setOpen] = useState(false);
    const closeSelect = () => setOpen(false);
    const toggleSelect = () => setOpen(!isOpen);
    const [value, setValue] = useState('Green');

    const clearSelected = (event: { stopPropagation(): void }) => {
        event?.stopPropagation();
        setValue('');
    };

    const selectItem = (item: any) => {
        if (value === item) {
            setValue('');
        } else {
            setValue(item);
        }
        closeSelect();
    };
    const onItemSelected = (choice: any) => () => selectItem(choice);

    return (
        <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap>
            <FlexBox orientation={Orientation.horizontal} gap={Size.big} wrap fillSpace>
                <TextField value={query} onChange={setQuery} icon={mdiMagnify} placeholder="Search" />

                <ChipGroup>
                    <Chip after={<Icon icon={mdiMenuDown} size={Size.xs} />} isClickable>
                        Type
                    </Chip>

                    <Select
                        isOpen={isOpen}
                        value={value}
                        label="Color"
                        variant={SelectVariant.chip}
                        onClear={clearSelected}
                        clearButtonProps={{ label: 'Clear' }}
                        onDropdownClose={closeSelect}
                        onInputClick={toggleSelect}
                    >
                        <List>
                            {COLORS.map((color, index) => (
                                <ListItem
                                    isSelected={value === color}
                                    key={index}
                                    onItemSelected={onItemSelected(color)}
                                    size={Size.tiny}
                                >
                                    {color}
                                </ListItem>
                            ))}
                        </List>
                    </Select>

                    <Chip after={<Icon icon={mdiMenuDown} size={Size.xs} />} isClickable>
                        Shape
                    </Chip>
                </ChipGroup>
            </FlexBox>

            <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown}>
                Most relevant
            </Button>
        </FlexBox>
    );
};
