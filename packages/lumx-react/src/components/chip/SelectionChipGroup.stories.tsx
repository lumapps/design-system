/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState } from 'react';
import { mdiFoodApple, mdiFruitCherries, mdiFruitCitrus, mdiFruitGrapes, mdiFruitWatermelon } from '@lumx/icons';
import { Chip, Icon, SelectionChipGroup, TextField } from '@lumx/react';
import { withResizableBox } from '@lumx/react/stories/decorators/withResizableBox';
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/Chip/SelectionChipGroupStories';

const { meta, ...stories } = setup({
    component: SelectionChipGroup,
    decorators: { withValueOnChange, withResizableBox },
});

export default {
    title: 'LumX components/chip/SelectionChipGroup',
    ...meta,
};

export const Default = { ...stories.Default };
export const Disabled = { ...stories.Disabled };
export const IndividuallyDisabled = { ...stories.IndividuallyDisabled };
export const Empty = { ...stories.Empty };
export const ConstrainedSpace = { ...stories.ConstrainedSpace };

/** Selection chip group with custom chip render */
export const CustomRender = {
    render() {
        const [value, setValue] = useState([
            { id: 'Apple', icon: mdiFoodApple },
            { id: 'Cherries', icon: mdiFruitCherries },
            { id: 'Citrus', icon: mdiFruitCitrus },
            { id: 'Grapes', icon: mdiFruitGrapes },
            { id: 'Watermelon', icon: mdiFruitWatermelon },
        ]);
        return (
            <SelectionChipGroup
                value={value}
                getOptionId="id"
                label="Selected fruits"
                chipRemoveLabel="Remove"
                onChange={(newValue) => setValue(newValue ?? [])}
                renderChip={(option) => <Chip before={<Icon icon={option.icon} size="xs" />} />}
            />
        );
    },
};

/** Selection chip group inside a TextField chips slot with inputRef for keyboard navigation */
export const InTextField = {
    render() {
        const inputRef = useRef<HTMLInputElement>(null);
        const [value, setValue] = useState([
            { id: '1', name: 'Apricot' },
            { id: '2', name: 'Apple' },
            { id: '3', name: 'Banana' },
        ]);
        const [text, setText] = useState('');
        return (
            <TextField
                label="Fruits"
                inputRef={inputRef}
                value={text}
                onChange={setText}
                chips={
                    <SelectionChipGroup
                        value={value}
                        getOptionId="id"
                        getOptionName="name"
                        label="Selected fruits"
                        chipRemoveLabel="Remove"
                        onChange={(newValue) => setValue(newValue ?? [])}
                        inputRef={inputRef}
                    />
                }
            />
        );
    },
};
