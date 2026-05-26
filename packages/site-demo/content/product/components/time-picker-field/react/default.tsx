import { useState } from 'react';
import { TimePickerField } from '@lumx/react';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

export default () => {
    const [value, onChange] = useState<Date | undefined>();
    return <TimePickerField label="Time" value={value} onChange={onChange} translations={TRANSLATIONS} />;
};
