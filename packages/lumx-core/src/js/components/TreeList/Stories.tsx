import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import type { TreeListComponents } from './Tests';

/** A tree item of the demo data (no `value`: not selectable). */
interface FoodItem {
    label: string;
    value?: string;
    description?: string;
    children?: FoodItem[];
}

const FOOD: FoodItem[] = [
    {
        label: 'Fruits',
        value: 'fruits',
        children: [
            {
                label: 'Citrus',
                children: [
                    { label: 'Lemon', value: 'lemon' },
                    { label: 'Orange', value: 'orange' },
                ],
            },
            { label: 'Apple', value: 'apple', description: 'Red or green' },
        ],
    },
    {
        label: 'Vegetables',
        value: 'vegetables',
        children: [
            { label: 'Leek', value: 'leek' },
            { label: 'Carrot', value: 'carrot' },
        ],
    },
    {
        label: 'Drinks',
        children: [
            { label: 'Lemonade', value: 'lemonade' },
            { label: 'Water', value: 'water' },
        ],
    },
];

/** Categories (non-selectable parent items), each with an "All <category>" leaf item for the parent value. */
const CATEGORIES: FoodItem[] = [
    {
        label: 'Fruits',
        children: [
            { label: 'All fruits', value: 'fruits' },
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
        ],
    },
    {
        label: 'Vegetables',
        children: [
            { label: 'All vegetables', value: 'vegetables' },
            { label: 'Leek', value: 'leek' },
            { label: 'Carrot', value: 'carrot' },
        ],
    },
];

const SNACKS: FoodItem[] = [
    { label: 'Chips', value: 'chips' },
    { label: 'Nuts', value: 'nuts' },
];

/** Label of each selectable tree item of the demo data, by value. */
const LABELS: Record<string, string> = {};
const addLabels = (items: FoodItem[]) =>
    items.forEach(({ label, value, children }) => {
        if (value !== undefined) LABELS[value] = label;
        if (children) addLabels(children);
    });
addLabels(FOOD);

/** Toggle a value in a list of values (multiple selection). */
const toggleValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

/**
 * Setup the TreeList demo stories for a specific framework (React or Vue): a tree in a combobox, or a
 * standalone tree. Framework-specific components and decorators are injected via options.
 */
export function setup({
    components: { TreeList, TreeListItem, Combobox },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: TreeListComponents;
    decorators: 'withValueOnChange';
}>) {
    /** Render the tree items of the demo data. */
    const renderItems = (items: FoodItem[], isSelected: (value: string) => boolean, selectionIcon?: boolean): any[] =>
        items.map(({ label, value, description, children }) => (
            <TreeListItem
                key={label}
                label={label}
                value={value}
                description={description}
                isSelected={value !== undefined && isSelected(value)}
                after={selectionIcon ? <Combobox.SelectionIcon /> : undefined}
            >
                {children && renderItems(children, isSelected, selectionIcon)}
            </TreeListItem>
        ));

    const meta = {
        component: TreeList,
    };

    /** State of the input stories: `{ text, selected }` (the input text and the selection), set with `onUpdate`. */
    const withInputState = withValueOnChange({ onChangeProp: 'onUpdate' });

    /**
     * Tree with an input trigger (auto filter): a tree item matches on its own label and description.
     * "Citrus" and "Drinks" have no value: they are not selectable.
     * The input shows the label of the selected tree item. It is not a search: only the text that
     * the user types filters the tree (the popup opens again with the full tree).
     */
    const TreeWithInput = {
        args: { value: { text: LABELS.apple, selected: 'apple' } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value.text}
                    onChange={(text: string) => onUpdate({ ...value, text })}
                    selectionMode="keep"
                    onSelect={(option: { value: string }) =>
                        onUpdate({ text: LABELS[option.value] ?? '', selected: option.value })
                    }
                    placeholder="Pick a food…"
                    toggleButtonProps={{ label: 'Food' }}
                />
                <Combobox.Popover>
                    <TreeList aria-label="Food">{renderItems(FOOD, (v) => v === value.selected)}</TreeList>
                    <Combobox.State
                        emptyMessage="No food found"
                        nbOptionMessage={(count: number) => `${count} result(s)`}
                    />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Inline tree: no `Combobox.Popover`, so the tree is always open below the input. The open state of
     * the parent items is kept (there is no popup to close).
     */
    const TreeInline = {
        args: { value: { text: LABELS.apple, selected: 'apple' } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value.text}
                    onChange={(text: string) => onUpdate({ ...value, text })}
                    selectionMode="keep"
                    onSelect={(option: { value: string }) =>
                        onUpdate({ text: LABELS[option.value] ?? '', selected: option.value })
                    }
                    placeholder="Pick a food…"
                />
                <TreeList aria-label="Food">{renderItems(FOOD, (v) => v === value.selected, true)}</TreeList>
                <Combobox.State emptyMessage="No food found" />
            </Combobox.Provider>
        ),
    };

    /** Tree with a button trigger (select-only): typeahead on the visible tree items. */
    const TreeWithButton = {
        args: { value: '' },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (option: any) => option?.value })],
        render: ({ value, onSelect }: any) => (
            <Combobox.Provider>
                <Combobox.Button label="Food" value={value} onSelect={onSelect} />
                <Combobox.Popover>
                    <TreeList aria-label="Food">{renderItems(FOOD, (v) => v === value)}</TreeList>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /** Multiple selection with `Combobox.SelectionIcon` (nothing on the non-selectable tree items). */
    const TreeWithMultipleSelection = {
        args: { value: { text: '', selected: ['lemon'] } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => {
            const { selected } = value;
            return (
                <Combobox.Provider>
                    <Combobox.Input
                        value={value.text}
                        onChange={(text: string) => onUpdate({ ...value, text })}
                        selectionMode="keep"
                        onSelect={(option: { value: string }) =>
                            onUpdate({ ...value, selected: toggleValue(selected, option.value) })
                        }
                        placeholder="Pick foods…"
                        toggleButtonProps={{ label: 'Food' }}
                    />
                    <Combobox.Popover>
                        <TreeList aria-label="Food" aria-multiselectable>
                            {renderItems(FOOD, (v) => selected.includes(v), true)}
                        </TreeList>
                    </Combobox.Popover>
                </Combobox.Provider>
            );
        },
    };

    /**
     * Category tree: non-selectable parent items (Enter or a click opens them), each with an
     * "All <category>" leaf item that carries the parent value. This also supports the touch screen
     * readers that cannot open a selectable parent item (iOS VoiceOver).
     */
    const TreeWithCategories = {
        args: { value: '' },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (option: any) => option?.value })],
        render: ({ value, onSelect }: any) => (
            <Combobox.Provider>
                <Combobox.Button label="Food" value={value} onSelect={onSelect} />
                <Combobox.Popover>
                    <TreeList aria-label="Food">
                        {renderItems(CATEGORIES, (v) => v === value, true)}
                        <TreeListItem label="Create a new category…" />
                    </TreeList>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Lazy parent item ("Snacks", `hasSubItems`): its sub-items load when the user opens it
     * (skeletons in the group meanwhile). The open state resets on each popup open: the loaded
     * sub-items are kept (cached) in the consumer state.
     * With an input, prefer `filter="manual"` with a search on the server (the auto filter only matches
     * the loaded tree items).
     */
    const TreeWithLazyParentItem = {
        args: { snacks: 'none' },
        decorators: [withValueOnChange({ valueProp: 'snacks', onChangeProp: 'onSnacksChange' })],
        render: ({ snacks, onSnacksChange }: any) => (
            <Combobox.Provider>
                <Combobox.Button label="Food" />
                <Combobox.Popover>
                    <TreeList aria-label="Food">
                        {renderItems(FOOD, () => false)}
                        <TreeListItem
                            label="Snacks"
                            value="snacks"
                            hasSubItems
                            onOpenChange={(isOpen: boolean) => {
                                if (!isOpen || snacks !== 'none') return;
                                onSnacksChange('loading');
                                setTimeout(() => onSnacksChange('loaded'), 1500);
                            }}
                        >
                            {snacks === 'loading' && <Combobox.OptionSkeleton count={2} />}
                            {snacks === 'loaded' && renderItems(SNACKS, () => false)}
                        </TreeListItem>
                    </TreeList>
                    <Combobox.State loadingMessage="Loading snacks…" />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Standalone tree (no combobox): the tree is its own focus owner (a single tab stop, the keyboard is
     * handled on the tree), and it is always open. `onSelect` is called on a selection (Enter, Space or
     * a click on a selectable tree item).
     */
    const StandaloneTree = {
        args: { value: 'lemon' },
        decorators: [withValueOnChange({ onChangeProp: 'onSelect', valueExtract: (option: any) => option?.value })],
        render: ({ value, onSelect }: any) => (
            <TreeList aria-label="Food" onSelect={onSelect}>
                {renderItems(FOOD, (v) => v === value)}
            </TreeList>
        ),
    };

    /** Standalone tree with multiple selection and `Combobox.SelectionIcon`. */
    const StandaloneTreeWithMultipleSelection = {
        args: { value: ['lemon', 'leek'] },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
        render: ({ value, onUpdate }: any) => (
            <TreeList
                aria-label="Food"
                aria-multiselectable
                onSelect={(option: { value: string }) => onUpdate(toggleValue(value, option.value))}
            >
                {renderItems(FOOD, (v) => value.includes(v), true)}
            </TreeList>
        ),
    };

    return {
        meta,
        TreeWithInput,
        TreeInline,
        TreeWithButton,
        TreeWithMultipleSelection,
        TreeWithCategories,
        TreeWithLazyParentItem,
        StandaloneTree,
        StandaloneTreeWithMultipleSelection,
    };
}
