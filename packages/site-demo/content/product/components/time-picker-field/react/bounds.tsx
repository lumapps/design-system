import { useState } from 'react';
import { TimePickerField } from '@lumx/react';

const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

const at = (hour: number, minute = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
};

export default () => {
    const [value, onChange] = useState<Date | undefined>(at(10, 0));
    return (
        <TimePickerField
            label="Working hours"
            helper="Pick a time between 9:00 and 18:00"
            value={value}
            onChange={onChange}
            minTime={at(9, 0)}
            maxTime={at(18, 0)}
            translations={TRANSLATIONS}
        />
    );
};
