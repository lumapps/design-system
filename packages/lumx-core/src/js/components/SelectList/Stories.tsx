import { userEvent } from 'storybook/test';

import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { FRUITS } from '../SelectButton/Stories';
import { TRANSLATIONS } from './Tests';

/**
 * Setup SelectList stories for a specific framework (React or Vue).
 */
export function setup({
    components: { SelectList },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: {
        SelectList: any;
    };
    decorators: 'withValueOnChange';
}>) {
    const meta = {
        component: SelectList,
    };

    /** Simple SelectList with basic options */
    const Default = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** SelectList with pre-selected value */
    const WithSelectedValue = {
        ...Default,
        args: { value: FRUITS[2] },
    };

    /** Options grouped into sections, with descriptions */
    const WithSections = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                getOptionDescription="description"
                getSectionId="category"
                value={value}
                onChange={onChange}
            />
        ),
    };

    /** Multiple selection — Enter, Space or click toggles the option */
    const MultipleSelection = {
        args: { value: [FRUITS[0], FRUITS[2]] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                selectionType="multiple"
                aria-label="Fruits"
                options={FRUITS}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={(v: any) => onChange(v ?? [])}
            />
        ),
    };

    /** Loading state — shows skeleton placeholders */
    const Loading = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
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

    /** Loading more state — appends a skeleton after existing options */
    const LoadingMore = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
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

    /** Error state — shows the error message */
    const ErrorState = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
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

    /** Empty state — shows the empty message */
    const EmptyState = {
        args: { value: undefined },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <SelectList
                aria-label="Fruits"
                options={[]}
                getOptionId="id"
                getOptionName="name"
                value={value}
                onChange={onChange}
                translations={TRANSLATIONS}
            />
        ),
    };

    /** Width: t-shirt size tokens or a percentage of the parent width */
    const Width = {
        render: () => (
            <>
                {(['m', 'l', 'xl', 'xxl', '50%'] as const).map((width) => (
                    <SelectList
                        key={width}
                        aria-label={`Fruits (${width})`}
                        width={width}
                        options={FRUITS.slice(0, 2)}
                        getOptionId="id"
                        getOptionName="name"
                    />
                ))}
            </>
        ),
    };

    return {
        meta,
        Width,
        Default,
        WithSelectedValue,
        WithSections,
        MultipleSelection,
        Loading,
        LoadingMore,
        ErrorState,
        EmptyState,
    };
}
