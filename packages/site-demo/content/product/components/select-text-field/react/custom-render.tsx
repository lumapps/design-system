import { useCallback, useState } from 'react';
import { Chip, Combobox, Icon, SelectTextField } from '@lumx/react';
import {
    mdiFoodApple,
    mdiFoodForkDrink,
    mdiFruitCitrus,
    mdiFruitGrapes,
    mdiFruitPineapple,
    mdiSprout,
} from '@lumx/icons';

interface Fruit {
    id: string;
    name: string;
    icon: string;
    category: string;
    categoryIcon: string;
}

const INITIAL_FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', icon: mdiFoodApple, category: 'Pome', categoryIcon: mdiFoodApple },
    { id: 'banana', name: 'Banana', icon: mdiSprout, category: 'Tropical', categoryIcon: mdiFruitPineapple },
    {
        id: 'pineapple',
        name: 'Pineapple',
        icon: mdiFruitPineapple,
        category: 'Tropical',
        categoryIcon: mdiFruitPineapple,
    },
    { id: 'grape', name: 'Grape', icon: mdiFruitGrapes, category: 'Berry', categoryIcon: mdiFruitGrapes },
    { id: 'lemon', name: 'Lemon', icon: mdiFruitCitrus, category: 'Citrus', categoryIcon: mdiFruitCitrus },
    { id: 'orange', name: 'Orange', icon: mdiFruitCitrus, category: 'Citrus', categoryIcon: mdiFruitCitrus },
];

const TRANSLATIONS = {
    showSuggestionsLabel: 'Show suggestions',
    chipGroupLabel: 'Selected fruits',
    chipRemoveLabel: 'Remove',
};

export default () => {
    const [value, onChange] = useState<Fruit[]>([INITIAL_FRUITS[1], INITIAL_FRUITS[3]]);
    const [search, setSearch] = useState('');
    const [fruits, setFruits] = useState(INITIAL_FRUITS);

    const handleCreate = useCallback(() => {
        const newFruit: Fruit = {
            id: search.toLowerCase(),
            name: search,
            icon: mdiFoodForkDrink,
            category: 'Custom',
            categoryIcon: mdiFoodForkDrink,
        };
        setFruits((prev) => [...prev, newFruit]);
        onChange((prev) => [...prev, newFruit]);
        setSearch('');
    }, [search]);

    const canCreate = search && !fruits.some((f) => f.name.toLowerCase() === search.toLowerCase());

    return (
        <SelectTextField<Fruit>
            selectionType="multiple"
            label="Select fruits"
            placeholder="Search fruits..."
            options={fruits}
            filter="auto"
            getOptionId="id"
            getOptionName="name"
            getSectionId="category"
            value={value}
            onChange={(v) => onChange(v ?? [])}
            onSearch={setSearch}
            searchInputValue={search}
            translations={TRANSLATIONS}
            renderChip={(fruit) => <Chip before={<Icon icon={fruit.icon} size="xs" />}>{fruit.name}</Chip>}
            beforeOptions={
                canCreate ? (
                    <SelectTextField.Section>
                        <SelectTextField.Option value={`__create__${search}`} onClick={handleCreate}>
                            {`Create "${search}"`}
                        </SelectTextField.Option>
                    </SelectTextField.Section>
                ) : undefined
            }
            renderOption={(fruit) => (
                <Combobox.Option before={<Icon icon={fruit.icon} size="xs" />}>{fruit.name}</Combobox.Option>
            )}
            renderSectionTitle={(sectionId, options) => (
                <>
                    <Icon icon={options[0].categoryIcon} size="xs" />
                    {sectionId}
                </>
            )}
        />
    );
};
