import { userEvent } from 'storybook/test';

import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TRANSLATIONS } from './Tests';

export interface Fruit {
    id: string;
    name: string;
    category: string;
    description?: string;
}

export const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', category: 'Pome', description: 'A sweet red fruit' },
    { id: 'apricot', name: 'Apricot', category: 'Stone', description: 'A soft orange fruit' },
    { id: 'banana', name: 'Banana', category: 'Tropical', description: 'A long yellow fruit' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry', description: 'A small blue fruit' },
    { id: 'cherry', name: 'Cherry', category: 'Stone', description: 'A small red fruit' },
    { id: 'grape', name: 'Grape', category: 'Berry', description: 'A small purple fruit' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus', description: 'A sour yellow fruit' },
    { id: 'orange', name: 'Orange', category: 'Citrus', description: 'A citrus fruit' },
    { id: 'peach', name: 'Peach', category: 'Stone', description: 'A soft fuzzy fruit' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry', description: 'A sweet red berry' },
];

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

    // ─── Loading and error states ───────────────────────────────

    const LOADING_TRANSLATIONS = { ...TRANSLATIONS, loadingMessage: 'Loading fruits…' };
    const ERROR_TRANSLATIONS = {
        ...TRANSLATIONS,
        errorMessage: 'Failed to load',
        errorTryReloadMessage: 'Please try again later',
    };
    const NB_OPTION_TRANSLATIONS = {
        ...TRANSLATIONS,
        emptyMessage: 'No results found',
        nbOptionMessage: (n: number) => `${n} result(s) available`,
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
                translations={LOADING_TRANSLATIONS}
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
                translations={LOADING_TRANSLATIONS}
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
                translations={ERROR_TRANSLATIONS}
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
                translations={NB_OPTION_TRANSLATIONS}
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
        WithNbOptionMessage,
        LabelDisplayModes,
    };
}
