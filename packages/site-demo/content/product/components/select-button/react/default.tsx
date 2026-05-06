import { useState } from 'react';
import { SelectButton } from '@lumx/react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange', 'Peach', 'Strawberry'];

export default () => {
    const [value, onChange] = useState<string | undefined>();
    return (
        <SelectButton label="Select a fruit" options={FRUITS} getOptionId={String} value={value} onChange={onChange} />
    );
};
