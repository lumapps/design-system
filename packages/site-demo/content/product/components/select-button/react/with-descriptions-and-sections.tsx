import { useState } from 'react';
import { SelectButton } from '@lumx/react';

const FRUITS = [
    { id: 'apricot', name: 'Apricot', category: 'Stone', description: 'A small orange fruit' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry', description: 'A small blue fruit' },
    { id: 'cherry', name: 'Cherry', category: 'Stone', description: 'A small red fruit' },
    { id: 'grape', name: 'Grape', category: 'Berry', description: 'A small purple fruit' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus', description: 'A sour yellow fruit' },
    { id: 'orange', name: 'Orange', category: 'Citrus', description: 'A round citrus fruit' },
    { id: 'peach', name: 'Peach', category: 'Stone', description: 'A soft fuzzy fruit' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry', description: 'A small red berry' },
];
type Fruit = (typeof FRUITS)[number];

export default () => {
    const [value, onChange] = useState<Fruit | undefined>();
    return (
        <SelectButton
            label="Select a fruit"
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            getOptionDescription="description"
            getSectionId="category"
            value={value}
            onChange={onChange}
        />
    );
};
