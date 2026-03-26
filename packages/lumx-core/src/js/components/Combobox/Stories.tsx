import { userEvent } from 'storybook/test';
import { mdiDelete, mdiPencil } from '@lumx/icons';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import type { ComboboxNamespace } from './Tests';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Orange', 'Peach', 'Strawberry'];

const GROUPED_FRUITS = [
    { label: 'Berries', fruits: ['Blueberry', 'Strawberry'] },
    { label: 'Citrus', fruits: ['Lemon', 'Orange'] },
    { label: 'Others', fruits: ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Peach'] },
];

/**
 * Setup Combobox demo stories for a specific framework (React or Vue).
 * Framework-specific components and hooks are injected via options.
 */
export function setup({
    components: { Combobox, IconButton, Avatar, SkeletonCircle },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: {
        Combobox: ComboboxNamespace;
        IconButton: any;
        Avatar: any;
        SkeletonCircle: any;
    };
    decorators: 'withValueOnChange';
}>) {
    const meta = {
        component: Combobox.Provider,
        async play() {
            userEvent.tab();
            userEvent.keyboard('{ArrowDown}');
        },
    };

    /** Combobox using the sub-component API with toggle button and popover. */
    const ComboboxWithSubcomponents = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /** Combobox with grouped options using ComboboxSection. */
    const ComboboxWithSection = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {GROUPED_FRUITS.map(({ label, fruits }) => (
                            <Combobox.Section key={label} label={label}>
                                {fruits.map((fruit) => (
                                    <Combobox.Option key={fruit} value={fruit}>
                                        {fruit}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Section>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with sections where the consumer pre-filters options (e.g. async search).
     * Sections with no matching options pass zero children to Combobox.Section,
     * which returns null — verifying the null-guard in the component.
     * Try typing "b" to see "Citrus" and "Others" disappear, or "lem" to keep only "Citrus".
     */
    const ComboboxWithFilteredSections = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
            const filter = value.toLowerCase();
            return (
                <Combobox.Provider>
                    <Combobox.Input
                        value={value}
                        onChange={onChange}
                        placeholder="Pick a fruit…"
                        toggleButtonProps={{ label: 'Fruits' }}
                    />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Fruits">
                            {GROUPED_FRUITS.map(({ label, fruits }) => {
                                const matched = fruits.filter((f) =>
                                    filter.length === 0 ? true : f.toLowerCase().startsWith(filter),
                                );
                                return (
                                    <Combobox.Section key={label} label={label}>
                                        {matched.map((fruit) => (
                                            <Combobox.Option key={fruit} value={fruit}>
                                                {fruit}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Section>
                                );
                            })}
                        </Combobox.List>
                    </Combobox.Popover>
                </Combobox.Provider>
            );
        },
    };

    /** Select-only combobox using ComboboxButton. */
    const ComboboxWithButton = {
        args: { value: '' },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (v: any) => v?.value })],
        render: ({ value, onSelect }: { value: string; onSelect: (option: { value: string }) => void }) => (
            <Combobox.Provider>
                <Combobox.Button label="Select a fruit" value={value} onSelect={onSelect} />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Grid combobox with input trigger — options have secondary action buttons (edit, delete).
     * Uses `type="grid"` on the Combobox and `after` prop on each option.
     * Supports 2D keyboard navigation: Up/Down between rows, Left/Right between cells.
     */
    const GridComboboxWithInput = {
        args: { value: '' },
        argTypes: { onEdit: { action: 'edit' }, onDelete: { action: 'delete' } },
        decorators: [withValueOnChange()],
        render: ({
            value,
            onChange,
            onEdit,
            onDelete,
        }: {
            value: string;
            onChange: (v: string) => void;
            onEdit: (fruit: string) => void;
            onDelete: (fruit: string) => void;
        }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List type="grid" aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option
                                key={fruit}
                                value={fruit}
                                after={
                                    <>
                                        <Combobox.OptionAction
                                            as={IconButton}
                                            icon={mdiPencil}
                                            label="Edit"
                                            emphasis="low"
                                            size="s"
                                            hideTooltip
                                            onClick={() => onEdit?.(fruit)}
                                        />
                                        <Combobox.OptionAction
                                            as={IconButton}
                                            icon={mdiDelete}
                                            label="Delete"
                                            emphasis="low"
                                            size="s"
                                            hideTooltip
                                            onClick={() => onDelete?.(fruit)}
                                        />
                                    </>
                                }
                            >
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Grid combobox with button trigger (select-only) — options have a delete action.
     * Demonstrates grid mode with ComboboxButton.
     */
    const GridComboboxWithButton = {
        args: { value: '' },
        argTypes: { onDelete: { action: 'delete' } },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (v: any) => v?.value })],
        render: ({
            value,
            onSelect,
            onDelete,
        }: {
            value: string;
            onSelect: (option: { value: string }) => void;
            onDelete: (fruit: string) => void;
        }) => (
            <Combobox.Provider>
                <Combobox.Button label="Select a fruit" value={value} onSelect={onSelect} />
                <Combobox.Popover>
                    <Combobox.List type="grid" aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option
                                key={fruit}
                                value={fruit}
                                after={
                                    <Combobox.OptionAction
                                        as={IconButton}
                                        icon={mdiDelete}
                                        label="Delete"
                                        emphasis="low"
                                        size="s"
                                        hideTooltip
                                        onClick={() => onDelete?.(fruit)}
                                    />
                                }
                            >
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /** Combobox with OptionMoreInfo showing additional details on hover/keyboard highlight. */
    const ComboboxWithOptionMoreInfo = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option
                                key={fruit}
                                value={fruit}
                                after={
                                    <Combobox.OptionMoreInfo>
                                        <p>
                                            <strong>{fruit}</strong>
                                            <br />A delicious fruit option with extra details.
                                        </p>
                                    </Combobox.OptionMoreInfo>
                                }
                            >
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with empty state — shown when no options match the current input.
     * Try typing something that matches no fruit (e.g. "xyz") to see the empty state.
     * Uses `Combobox.State` with an `emptyMessage` callback that includes the input value.
     */
    const ComboboxWithEmptyState = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                    <Combobox.State
                        emptyMessage={(inputValue: string) =>
                            inputValue ? `No results for "${inputValue}"` : 'No results'
                        }
                    />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with error state — shown when the data fails to load.
     * Uses `Combobox.State` with an `errorMessage` (and optional `errorTryReloadMessage`).
     * The error state takes priority over the empty state.
     */
    const ComboboxWithErrorState = {
        render: () => (
            <Combobox.Provider>
                <Combobox.Input value="" placeholder="Pick a fruit…" toggleButtonProps={{ label: 'Fruits' }} />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">{/* no options — simulating a failed load */}</Combobox.List>
                    <Combobox.State errorMessage="Service unavailable" errorTryReloadMessage="Please try again later" />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with loading skeletons — initial load, no options yet.
     * Uses `Combobox.OptionSkeleton` with `count={3}` to render 3 skeleton placeholders.
     * The `Combobox.State` shows a loading message after 500ms.
     */
    const ComboboxWithLoading = {
        render: () => (
            <Combobox.Provider>
                <Combobox.Input value="" placeholder="Pick a fruit…" toggleButtonProps={{ label: 'Fruits' }} />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        <Combobox.OptionSkeleton count={3} />
                    </Combobox.List>
                    <Combobox.State loadingMessage="Loading fruits…" emptyMessage="No results" />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with "load more" pattern — real options with skeletons appended.
     * Simulates loading additional items at the end of an existing list.
     */
    const ComboboxWithLoadMore = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {FRUITS.map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                        <Combobox.OptionSkeleton count={3} />
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with per-section loading — one section loaded, another still loading.
     * Demonstrates skeletons inside a `Combobox.Section`.
     */
    const ComboboxWithSectionLoading = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value}
                    onChange={onChange}
                    placeholder="Pick a fruit…"
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        <Combobox.Section label="Berries">
                            {GROUPED_FRUITS[0].fruits.map((fruit) => (
                                <Combobox.Option key={fruit} value={fruit}>
                                    {fruit}
                                </Combobox.Option>
                            ))}
                        </Combobox.Section>
                        <Combobox.Section label="Loading more…">
                            <Combobox.OptionSkeleton count={3} />
                        </Combobox.Section>
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Combobox with avatar options and matching skeleton placeholders.
     * Options use `Avatar` in the `before` slot; skeletons use `SkeletonCircle`
     * to match the avatar shape during loading.
     */
    const ComboboxWithAvatarLoading = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
            const users = [
                { id: 'alice', name: 'Alice Martin', avatar: 'https://i.pravatar.cc/128?img=32' },
                { id: 'bob', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/128?img=33' },
                { id: 'carol', name: 'Carol Williams', avatar: 'https://i.pravatar.cc/128?img=34' },
            ];
            const isLoading = true;

            return (
                <Combobox.Provider>
                    <Combobox.Input
                        value={value}
                        onChange={onChange}
                        placeholder="Search users…"
                        toggleButtonProps={{ label: 'Users' }}
                    />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Users">
                            {users.map((user) => (
                                <Combobox.Option
                                    key={user.id}
                                    value={user.name}
                                    before={<Avatar image={user.avatar} alt={user.name} size="xs" />}
                                >
                                    {user.name}
                                </Combobox.Option>
                            ))}
                            {isLoading && <Combobox.OptionSkeleton count={3} before={<SkeletonCircle size="xs" />} />}
                        </Combobox.List>
                        <Combobox.State loadingMessage="Loading users…" />
                    </Combobox.Popover>
                </Combobox.Provider>
            );
        },
    };

    return {
        meta,
        ComboboxWithSubcomponents,
        ComboboxWithSection,
        ComboboxWithFilteredSections,
        ComboboxWithButton,
        ComboboxWithOptionMoreInfo,
        GridComboboxWithInput,
        GridComboboxWithButton,
        ComboboxWithEmptyState,
        ComboboxWithErrorState,
        ComboboxWithLoading,
        ComboboxWithLoadMore,
        ComboboxWithSectionLoading,
        ComboboxWithAvatarLoading,
    };
}
