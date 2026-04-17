import { useState } from 'react';
import { SelectTextField } from '@lumx/react';

const FRUITS = [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'cherry', name: 'Cherry' },
    { id: 'grape', name: 'Grape' },
    { id: 'orange', name: 'Orange' },
    { id: 'peach', name: 'Peach' },
    { id: 'strawberry', name: 'Strawberry' },
];

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

export default () => {
    const [value, onChange] = useState<(typeof FRUITS)[number] | undefined>();
    return (
        <SelectTextField
            selectionType="single"
            label="Select a fruit"
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
