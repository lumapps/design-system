import { userEvent } from 'storybook/test';
import {
    mdiFoodApple,
    mdiFruitCherries,
    mdiFruitCitrus,
    mdiFruitGrapes,
    mdiFruitWatermelon,
    mdiMagnify,
    mdiSprout,
} from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TRANSLATIONS, MULTI_TRANSLATIONS } from './Tests';

export const FRUITS = [
    {
        id: 'apple',
        name: 'Apple',
        icon: mdiFoodApple,
        category: 'Pome',
        categoryIcon: mdiFoodApple,
        description: 'A sweet red fruit',
    },
    {
        id: 'apricot',
        name: 'Apricot',
        icon: mdiFruitCherries,
        category: 'Stone',
        categoryIcon: mdiFruitCherries,
        description: 'A soft orange fruit',
    },
    {
        id: 'banana',
        name: 'Banana',
        icon: mdiSprout,
        category: 'Tropical',
        categoryIcon: mdiSprout,
        description: 'A long yellow fruit',
    },
    {
        id: 'blueberry',
        name: 'Blueberry',
        icon: mdiFruitGrapes,
        category: 'Berry',
        categoryIcon: mdiFruitGrapes,
        description: 'A small blue fruit',
    },
    {
        id: 'cherry',
        name: 'Cherry',
        icon: mdiFruitCherries,
        category: 'Stone',
        categoryIcon: mdiFruitCherries,
        description: 'A small red fruit',
    },
    {
        id: 'grape',
        name: 'Grape',
        icon: mdiFruitGrapes,
        category: 'Berry',
        categoryIcon: mdiFruitGrapes,
        description: 'A small purple fruit',
    },
    {
        id: 'lemon',
        name: 'Lemon',
        icon: mdiFruitCitrus,
        category: 'Citrus',
        categoryIcon: mdiFruitCitrus,
        description: 'A sour yellow fruit',
    },
    {
        id: 'orange',
        name: 'Orange',
        icon: mdiFruitCitrus,
        category: 'Citrus',
        categoryIcon: mdiFruitCitrus,
        description: 'A citrus fruit',
    },
    {
        id: 'peach',
        name: 'Peach',
        icon: mdiFruitCherries,
        category: 'Stone',
        categoryIcon: mdiFruitCherries,
        description: 'A soft fuzzy fruit',
    },
    {
        id: 'strawberry',
        name: 'Strawberry',
        icon: mdiFruitWatermelon,
        category: 'Berry',
        categoryIcon: mdiFruitGrapes,
        description: 'A sweet red berry',
    },
];

export type Fruit = (typeof FRUITS)[number];

/**
 * Setup SelectTextField stories for a specific framework (React or Vue).
 */
export function setup({
    components: { SelectTextField },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: {
        SelectTextField: any;
    };
    decorators: 'withValueOnChange';
}>) {
    const meta = {
        component: SelectTextField,
        async play({ canvas }: any) {
            const combobox = await canvas.findByRole('combobox');
            await userEvent.click(combobox);
        },
    };

    /** Simple SelectTextField with basic options */
    const Default = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with pre-selected value */
    const WithSelectedValue = {
        args: { value: FRUITS[3] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with clear button disabled */
    const NoClearButton = {
        args: { value: FRUITS[0] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                hasClearButton={false}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with option descriptions */
    const WithDescriptions = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                getOptionDescription="description"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with options grouped into labelled sections */
    const WithSections = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                getSectionId="category"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with a leading icon */
    const WithIcon = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                icon={mdiMagnify}
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField in disabled state */
    const Disabled = {
        args: { value: FRUITS[0] },
        decorators: [withValueOnChange()],
        play: undefined as any,
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                isDisabled
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with error state */
    const WithError = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                hasError
                error="Please select a fruit"
                translations={TRANSLATIONS}
            />
        ),
    };

    /** SelectTextField with helper text */
    const WithHelper = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                helper="Choose your favorite fruit"
                translations={TRANSLATIONS}
            />
        ),
    };

    // ─── Multiple selection ──────────────────────────────────────

    /** Multiple selection — basic usage with chips */
    const MultipleSelection = {
        args: { value: [] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="multiple"
                label="Select fruits"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
                translations={MULTI_TRANSLATIONS}
            />
        ),
    };

    /** Multiple selection with pre-selected values */
    const MultipleWithPreselected = {
        args: { value: [FRUITS[0], FRUITS[2], FRUITS[4]] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="multiple"
                label="Select fruits"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
                translations={MULTI_TRANSLATIONS}
            />
        ),
    };

    /** Multiple selection with many chips, including long labels that overflow */
    const MultipleWithManyChips = {
        args: {
            value: [
                FRUITS[0],
                FRUITS[1],
                FRUITS[2],
                FRUITS[3],
                FRUITS[4],
                FRUITS[5],
                {
                    id: 'dragon-fruit',
                    name: 'Dragon Fruit from the Exotic Tropical Rainforests of Southeast Asia',
                    category: 'Tropical',
                },
                FRUITS[6],
                FRUITS[7],
                {
                    id: 'passion-fruit',
                    name: 'Extremely Rare Golden Passion Fruit Grown in the High Altitude Volcanic Soils of South America',
                    category: 'Tropical',
                },
                FRUITS[8],
                FRUITS[9],
            ],
        },
        decorators: [withValueOnChange()],
        play: undefined as any,
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="multiple"
                label="Select fruits"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
                translations={MULTI_TRANSLATIONS}
            />
        ),
    };

    /** Multiple selection — disabled state with chips */
    const MultipleDisabled = {
        args: { value: [FRUITS[0], FRUITS[2]] },
        decorators: [withValueOnChange()],
        play: undefined as any,
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="multiple"
                label="Select fruits"
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
                isDisabled
                translations={MULTI_TRANSLATIONS}
            />
        ),
    };

    // ─── Option count message ────────────────────────────────────

    const NB_OPTION_TRANSLATIONS = {
        ...TRANSLATIONS,
        emptyMessage: 'No results found',
        nbOptionMessage: (n: number) => `${n} result(s) available`,
    };

    /** SelectTextField with option count message — shows how many results are available */
    const WithNbOptionMessage = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS}
                filter="auto"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={NB_OPTION_TRANSLATIONS}
            />
        ),
    };

    // ─── Loading and error states ───────────────────────────────

    const LOADING_TRANSLATIONS = {
        ...TRANSLATIONS,
        loadingMessage: 'Loading fruits…',
    };

    const ERROR_TRANSLATIONS = {
        ...TRANSLATIONS,
        errorMessage: 'Failed to load',
        errorTryReloadMessage: 'Please try again later',
    };

    /** Full loading state — shows skeleton placeholders instead of options */
    const Loading = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={[]}
                filter="manual"
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
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={FRUITS.slice(0, 3)}
                filter="manual"
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
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Search fruits..."
                options={[]}
                filter="manual"
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                listStatus="error"
                translations={ERROR_TRANSLATIONS}
            />
        ),
    };

    return {
        meta,
        Default,
        WithSelectedValue,
        NoClearButton,
        WithDescriptions,
        WithSections,
        WithIcon,
        Disabled,
        WithError,
        WithHelper,
        MultipleSelection,
        MultipleWithPreselected,
        MultipleWithManyChips,
        MultipleDisabled,
        WithNbOptionMessage,
        Loading,
        LoadingMore,
        ErrorState,
    };
}
