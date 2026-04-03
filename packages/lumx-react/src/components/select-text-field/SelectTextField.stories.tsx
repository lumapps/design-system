/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback } from 'react';
import type { Meta } from '@storybook/react-vite';

import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup, FRUITS, type Fruit } from '@lumx/core/js/components/SelectTextField/Stories';
import { MULTI_TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';

import { SelectTextField } from '.';
import { Chip } from '../chip';
import { Icon } from '../icon';
import { Combobox } from '../combobox';

const { meta, ...stories } = setup({
    components: { SelectTextField },
    decorators: { withValueOnChange },
});

const defaultMeta: Meta<typeof SelectTextField> = {
    title: 'LumX components/select-text-field/SelectTextField',
    ...meta,
};
export default defaultMeta;

export const Default = { ...stories.Default };
export const WithSelectedValue = { ...stories.WithSelectedValue };
export const NoClearButton = { ...stories.NoClearButton };
export const WithDescriptions = { ...stories.WithDescriptions };
export const WithSections = { ...stories.WithSections };
export const WithIcon = { ...stories.WithIcon };
export const Disabled = { ...stories.Disabled };
export const WithError = { ...stories.WithError };
export const WithHelper = { ...stories.WithHelper };
export const MultipleSelection = { ...stories.MultipleSelection };
export const MultipleWithPreselected = { ...stories.MultipleWithPreselected };
export const MultipleWithManyChips = { ...stories.MultipleWithManyChips };
export const MultipleDisabled = { ...stories.MultipleDisabled };
export const Loading = { ...stories.Loading };
export const LoadingMore = { ...stories.LoadingMore };
export const ErrorState = { ...stories.ErrorState };

// ── Framework-specific stories (use React hooks for complex state) ──

/** SelectTextField with custom option, section title, and chip rendering */
export const CustomRender = () => {
    const [value, setValue] = useState<Fruit[]>([FRUITS[0], FRUITS[4]]);

    return (
        <SelectTextField<Fruit>
            selectionType="multiple"
            label="Select fruits"
            placeholder="Search fruits..."
            options={FRUITS}
            filter="auto"
            getOptionId="id"
            getOptionName="name"
            getSectionId="category"
            value={value}
            onChange={(v) => setValue(v ?? [])}
            translations={MULTI_TRANSLATIONS}
            renderOption={(fruit: Fruit) => (
                <Combobox.Option value={fruit.id} before={<Icon icon={fruit.icon} size="xs" />}>
                    {fruit.name}
                </Combobox.Option>
            )}
            renderSectionTitle={(sectionId: string, options: Fruit[]) => (
                <>
                    <Icon icon={options[0].categoryIcon} size="xs" />
                    {sectionId}
                </>
            )}
            renderChip={(fruit: Fruit) => <Chip before={<Icon icon={fruit.icon} size="xs" />}>{fruit.name}</Chip>}
        />
    );
};

/** SelectTextField with a creatable option before the list, using `searchInputValue` to reset the input after creation */
export const WithCreatableOptionsRender = () => {
    const [value, setValue] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState(['Apple', 'Banana', 'Cherry', 'Orange']);

    const handleCreate = useCallback((name: string) => {
        setOptions((prev) => (prev.includes(name) ? prev : [...prev, name]));
        setValue((prev) => [...prev, name]);
        setSearch(''); // reset the search input after creation
    }, []);

    const canCreate = search && !options.some((o) => o.toLowerCase() === search.toLowerCase());

    return (
        <SelectTextField<string>
            selectionType="multiple"
            label="Select or create a fruit"
            placeholder="Type to search or create..."
            options={options}
            filter="auto"
            getOptionId={String}
            value={value}
            onChange={(v) => setValue(v ?? [])}
            onSearch={setSearch}
            searchInputValue={search}
            beforeOptions={
                canCreate ? (
                    <SelectTextField.Section>
                        <SelectTextField.Option value={`__create__${search}`} onClick={() => handleCreate(search)}>
                            {`Create "${search}"`}
                        </SelectTextField.Option>
                    </SelectTextField.Section>
                ) : undefined
            }
            translations={MULTI_TRANSLATIONS}
        />
    );
};
