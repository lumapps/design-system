import { useState } from 'react';
import { SelectTextField } from '@lumx/react';

const FRUITS = [
    { id: 'apple', name: 'Apple', category: 'Pome' },
    { id: 'banana', name: 'Banana', category: 'Tropical' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry' },
    { id: 'cherry', name: 'Cherry', category: 'Stone' },
    { id: 'grape', name: 'Grape', category: 'Berry' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus' },
    { id: 'orange', name: 'Orange', category: 'Citrus' },
    { id: 'peach', name: 'Peach', category: 'Stone' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry' },
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
            getSectionId="category"
            value={value}
            onChange={onChange}
            translations={TRANSLATIONS}
        />
    );
};
