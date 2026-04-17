import { useState } from 'react';
import { SelectTextField } from '@lumx/react';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
    emptyMessage: 'No options available',
};

export default () => {
    const [value, onChange] = useState<{ id: string; name: string } | undefined>();
    return (
        <SelectTextField
            selectionType="single"
            label="Select a fruit"
            placeholder="Search fruits..."
            options={[]}
            filter="auto"
            getOptionId="id"
            getOptionName="name"
            value={value}
            onChange={onChange}
            translations={TRANSLATIONS}
        />
    );
};
