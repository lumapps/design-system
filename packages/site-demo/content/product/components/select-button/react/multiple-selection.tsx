import { useState } from 'react';
import { SelectButton } from '@lumx/react';

const FRUITS = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

export default () => {
    const [value, onChange] = useState([FRUITS[0], FRUITS[2]]);
    return (
        <SelectButton
            selectionType="multiple"
            label="Select fruits"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            value={value}
            onChange={(newValue = []) => onChange(newValue)}
        />
    );
};
