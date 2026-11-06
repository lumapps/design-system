import { useState } from 'react';
import { SelectList } from '@lumx/react';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Grape', 'Orange'];

export default () => {
    const [value, onChange] = useState<string | undefined>('Banana');
    return <SelectList aria-label="Fruits" options={FRUITS} getOptionId={String} value={value} onChange={onChange} />;
};
