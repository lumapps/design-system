import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import type { TreeListComponents } from './Tests';

/** A tree item of the food tree (no `value`: not selectable). */
interface FoodItem {
    label: string;
    value?: string;
    description?: string;
    children?: FoodItem[];
}

/** The food tree of the stories: "Citrus" and "Drinks" have no value, they are not selectable. */
const FOOD_TREE: FoodItem[] = [
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

/** The `[value, label]` pairs of the selectable tree items. */
const collectLabels = (items: FoodItem[]): Array<[string, string]> =>
    items.flatMap(({ label, value, children = [] }) => [
        ...(value ? [[value, label] as [string, string]] : []),
        ...collectLabels(children),
    ]);

/** Label of each selectable tree item of the food tree, by value (the input stories show it as the input text). */
const LABELS: Record<string, string> = Object.fromEntries(collectLabels(FOOD_TREE));

/** Render the food tree items (recursive). */
function renderFoodTree(TreeListItem: any, items: FoodItem[] = FOOD_TREE): any {
    return items.map(({ label, value, description, children }) => (
        <TreeListItem key={label} label={label} value={value} description={description}>
            {children && renderFoodTree(TreeListItem, children)}
        </TreeListItem>
    ));
}

/**
 * Setup the TreeList demo stories for a specific framework (React or Vue): a standalone tree, or a tree in a
 * combobox. Framework-specific components and decorators are injected via options.
 */
export function setup({
    components: { TreeList, TreeListItem, Combobox },
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: TreeListComponents;
    decorators: 'withValueOnChange';
}>) {
    const meta = {
        component: TreeList,
    };

    /** State of the input stories: `{ text, selected }` (the input text and the selection), set with `onUpdate`. */
    const withInputState = withValueOnChange({ onChangeProp: 'onUpdate' });

    /**
     * Standalone tree (no combobox): the tree is its own focus owner (a single tab stop, the keyboard is
     * handled on the tree), and it is always open. `onChange` is called with the selected value (Enter, Space
     * or a click on a selectable tree item).
     */
    const Standalone = {
        args: { value: 'lemon' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <TreeList aria-label="Food" value={value} onChange={onChange}>
                {renderFoodTree(TreeListItem)}
            </TreeList>
        ),
    };

    /** Standalone tree with multiple selection: `onChange` gets the toggled values. */
    const StandaloneMultipleSelection = {
        args: { value: ['lemon', 'leek'] },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <TreeList aria-label="Food" selectionType="multiple" value={value} onChange={onChange}>
                {renderFoodTree(TreeListItem)}
            </TreeList>
        ),
    };

    /**
     * Tree with an input trigger (auto filter): a tree item matches on its own label and description.
     * The input shows the label of the selected tree item (the tree `onChange`). It is not a search: only the
     * text that the user types filters the tree (the popup opens again with the full tree).
     */
    const InComboboxInput = {
        args: { value: { text: LABELS.apple, selected: 'apple' } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value.text}
                    onChange={(text: string) => onUpdate({ ...value, text })}
                    selectionMode="keep"
                    placeholder="Pick a food…"
                    toggleButtonProps={{ label: 'Food' }}
                />
                <Combobox.Popover>
                    <TreeList
                        aria-label="Food"
                        value={value.selected}
                        onChange={(selected: string) => onUpdate({ text: LABELS[selected] ?? '', selected })}
                    >
                        {renderFoodTree(TreeListItem)}
                    </TreeList>
                    <Combobox.State
                        emptyMessage="No food found"
                        nbOptionMessage={(count: number) => `${count} result(s)`}
                    />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * InComboboxInline tree: no `Combobox.Popover`, so the tree is always open below the input. The open state of
     * the parent items is kept (there is no popup to close).
     */
    const InComboboxInline = {
        args: { value: { text: LABELS.apple, selected: 'apple' } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value.text}
                    onChange={(text: string) => onUpdate({ ...value, text })}
                    selectionMode="keep"
                    placeholder="Pick a food…"
                />
                <TreeList
                    aria-label="Food"
                    value={value.selected}
                    onChange={(selected: string) => onUpdate({ text: LABELS[selected] ?? '', selected })}
                >
                    {renderFoodTree(TreeListItem)}
                </TreeList>
                <Combobox.State emptyMessage="No food found" />
            </Combobox.Provider>
        ),
    };

    /** Tree with a button trigger (select-only): typeahead on the visible tree items. */
    const InComboboxButton = {
        args: { value: '' },
        decorators: [withValueOnChange()],
        render: ({ value, onChange }: any) => (
            <Combobox.Provider>
                <Combobox.Button label="Food" value={value} />
                <Combobox.Popover>
                    <TreeList aria-label="Food" value={value} onChange={onChange}>
                        {renderFoodTree(TreeListItem)}
                    </TreeList>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /** Multiple selection: a checkbox icon on the selectable tree items (nothing on the non-selectable ones). */
    const InComboboxMultipleSelection = {
        args: { value: { text: '', selected: ['lemon'] } },
        decorators: [withInputState],
        render: ({ value, onUpdate }: any) => (
            <Combobox.Provider>
                <Combobox.Input
                    value={value.text}
                    onChange={(text: string) => onUpdate({ ...value, text })}
                    selectionMode="keep"
                    placeholder="Pick foods…"
                    toggleButtonProps={{ label: 'Food' }}
                />
                <Combobox.Popover>
                    <TreeList
                        aria-label="Food"
                        selectionType="multiple"
                        value={value.selected}
                        onChange={(selected: string[]) => onUpdate({ ...value, selected })}
                    >
                        {renderFoodTree(TreeListItem)}
                    </TreeList>
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    /**
     * Lazy parent item ("Snacks", `hasSubItems`): its sub-items load when the user opens it (skeletons in the
     * group meanwhile, and the loading message of `Combobox.State` after its delay). The open state resets on
     * each popup open: the loaded sub-items are kept (cached) in the consumer state.
     * With an input, prefer `filter="manual"` with a search on the server (the auto filter only matches the
     * loaded tree items).
     */
    const LazyParentItem = {
        args: { snacks: 'none' },
        decorators: [withValueOnChange({ valueProp: 'snacks', onChangeProp: 'onSnacksChange' })],
        render: ({ snacks, onSnacksChange }: any) => (
            <Combobox.Provider>
                <Combobox.Button label="Food" />
                <Combobox.Popover>
                    <TreeList aria-label="Food">
                        {renderFoodTree(TreeListItem)}
                        <TreeListItem
                            label="Snacks"
                            value="snacks"
                            hasSubItems
                            onOpenChange={(isOpen: boolean) => {
                                if (!isOpen || snacks !== 'none') return;
                                onSnacksChange('loading');
                                setTimeout(() => onSnacksChange('loaded'), 1000);
                            }}
                        >
                            {snacks === 'loading' && <Combobox.OptionSkeleton count={2} />}
                            {snacks === 'loaded' && (
                                <>
                                    <TreeListItem label="Chips" value="chips" />
                                    <TreeListItem label="Nuts" value="nuts" />
                                </>
                            )}
                        </TreeListItem>
                    </TreeList>
                    <Combobox.State loadingMessage="Loading snacks…" />
                </Combobox.Popover>
            </Combobox.Provider>
        ),
    };

    return {
        meta,
        Standalone,
        StandaloneMultipleSelection,
        InComboboxInput,
        InComboboxInline,
        InComboboxButton,
        InComboboxMultipleSelection,
        LazyParentItem,
    };
}
