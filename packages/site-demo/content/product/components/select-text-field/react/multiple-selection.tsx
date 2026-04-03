import { useState } from 'react';
import { SelectTextField } from '@lumx/react';

interface Fruit {
    id: string;
    name: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const TRANSLATIONS = {
    showSuggestionsLabel: 'Show suggestions',
    chipGroupLabel: 'Selected fruits',
    chipRemoveLabel: 'Remove',
};

export default () => {
    const [value, onChange] = useState<Fruit[] | undefined>([FRUITS[0], FRUITS[2]]);

    return (
        <SelectTextField<Fruit>
            selectionType="multiple"
            label="Select fruits"
            placeholder="Search fruits..."
            options={FRUITS}
            filter="auto"
            getOptionId="id"
            getOptionName="name"
            value={value}
            onChange={onChange}
            translations={TRANSLATIONS}
        />
    );
};
