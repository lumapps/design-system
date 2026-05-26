import { useState } from 'react';
import { TimePickerField } from '@lumx/react';

const TRANSLATIONS = {
    clearLabel: 'Effacer',
    showSuggestionsLabel: 'Afficher les suggestions',
};

const at = (hour: number, minute: number) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
};

export default () => {
    const [value, onChange] = useState<Date | undefined>(at(14, 30));
    return (
        <TimePickerField label="Heure" locale="fr-FR" value={value} onChange={onChange} translations={TRANSLATIONS} />
    );
};
