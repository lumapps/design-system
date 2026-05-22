import { userEvent } from 'storybook/test';
import { mdiFruitCherries, mdiFruitCitrus, mdiFruitGrapes, mdiFruitWatermelon } from '@lumx/icons';

import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TRANSLATIONS } from './Tests';

const CAT_STONE = { category: 'Stone', categoryIcon: mdiFruitCherries };
const CAT_BERRY = { category: 'Berry', categoryIcon: mdiFruitGrapes };
const CAT_CITRUS = { category: 'Citrus', categoryIcon: mdiFruitCitrus };

export const FRUITS = [
    { id: '0', name: 'Apricot', icon: mdiFruitCherries, description: 'A soft orange fruit', ...CAT_STONE },
    { id: '1', name: 'Blueberry', icon: mdiFruitGrapes, description: 'A small blue fruit', ...CAT_BERRY },
    { id: '2', name: 'Cherry', icon: mdiFruitCherries, description: 'A small red fruit', ...CAT_STONE },
    { id: '3', name: 'Grape', icon: mdiFruitGrapes, description: 'A small purple fruit', ...CAT_BERRY },
    { id: '4', name: 'Lemon', icon: mdiFruitCitrus, description: 'A sour yellow fruit', ...CAT_CITRUS },
    { id: '5', name: 'Orange', icon: mdiFruitCitrus, description: 'A citrus fruit', ...CAT_CITRUS },
    { id: '6', name: 'Peach', icon: mdiFruitCherries, description: 'A soft fuzzy fruit', ...CAT_STONE },
    { id: '7', name: 'Strawberry', icon: mdiFruitWatermelon, description: 'A sweet red berry', ...CAT_BERRY },
];

export type Fruit = (typeof FRUITS)[number];

/**
 * Setup SelectButton stories for a specific framework (React or Vue).
 */
export function setup({
    components: { SelectButton },
    decorators: { withValueOnChange, withCombinations },
}: SetupStoriesOptions<{
    components: {
        SelectButton: any;
    };
    decorators: 'withValueOnChange' | 'withCombinations';
}>) {
    const meta = {
        component: SelectButton,
        async play({ canvas }: any) {
            const combobox = await canvas.findByRole('combobox');
            await userEvent.click(combobox);
        },
    };

    /** Simple SelectButton with basic options */
    const Default = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** SelectButton with pre-selected value */
    const WithSelectedValue = {
        args: { value: FRUITS[3] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** SelectButton with options grouped into labelled sections */
    const WithSections = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                getSectionId="category"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** SelectButton with option descriptions displayed under each option */
    const WithDescriptions = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                getOptionDescription="description"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** SelectButton in disabled state */
    const Disabled = {
        args: { value: FRUITS[0] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                isDisabled
            />
        ),
    };

    /** Full loading state — shows skeleton placeholders instead of options */
    const Loading = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={[]}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                listStatus="loading"
                translations={TRANSLATIONS}
            />
        ),
    };

    /** Loading more state — appends skeleton after existing options */
    const LoadingMore = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS.slice(0, 3)}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                listStatus="loadingMore"
                translations={TRANSLATIONS}
            />
        ),
    };

    /** Error state — shows error message in the dropdown */
    const ErrorState = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={[]}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                listStatus="error"
                translations={TRANSLATIONS}
            />
        ),
    };

    /** Multiple selection — toggling options keeps the dropdown open */
    const MultipleSelection = {
        args: { value: [] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                selectionType="multiple"
                label="Select fruits"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
            />
        ),
    };

    /** Multiple selection with pre-selected values — names are joined with ", " in the trigger */
    const MultipleWithPreselected = {
        args: { value: [FRUITS[0], FRUITS[2], FRUITS[4]] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                selectionType="multiple"
                label="Select fruits"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
            />
        ),
    };

    /** SelectButton with option count message — shows how many results are available */
    const WithNbOptionMessage = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /**
     * All combinations of `labelDisplayMode` × selection state.
     * Demonstrates how the button content changes for each mode.
     */
    const LabelDisplayModes = {
        // Override the meta `play` (which auto-opens the first combobox) — combinations
        // render multiple SelectButtons so opening one would be misleading.
        play: () => {},
        argTypes: { labelDisplayMode: { control: false }, value: { control: false } },
        render: ({ value, labelDisplayMode }: any) => (
            <SelectButton
                label="Select a fruit"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                labelDisplayMode={labelDisplayMode}
            />
        ),
        decorators: [
            withCombinations({
                combinations: {
                    cols: {
                        'show-selection (default)': { labelDisplayMode: undefined },
                        'show-label': { labelDisplayMode: 'show-label' },
                        'show-tooltip': { labelDisplayMode: 'show-tooltip' },
                    },
                    rows: {
                        'No selection': { value: undefined },
                        'With selection': { value: FRUITS[2] },
                    },
                },
            }),
        ],
    };

    return {
        meta,
        Default,
        WithSelectedValue,
        WithSections,
        WithDescriptions,
        Disabled,
        Loading,
        LoadingMore,
        ErrorState,
        MultipleSelection,
        MultipleWithPreselected,
        WithNbOptionMessage,
        LabelDisplayModes,
    };
}
