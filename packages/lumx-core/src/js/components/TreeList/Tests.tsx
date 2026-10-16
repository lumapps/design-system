/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/dom';
import { getByClassName, queryAllByClassName } from '../../../testing/queries';
import { CLASSNAME as SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';

// ─── Types ───────────────────────────────────────────────────────

/** Combobox components used by the tree tests (the shared list sub-components work in a tree too). */
export interface TreeListComboboxNamespace {
    Provider: any;
    Input: any;
    Button: any;
    Popover: any;
    OptionSkeleton: any;
    SelectionIcon: any;
    State: any;
}

/** Components used by the tree tests and stories. */
export interface TreeListComponents {
    /** The tree (standalone, or in a combobox). */
    TreeList: any;
    TreeListItem: any;
    Combobox: TreeListComboboxNamespace;
}

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the tree list test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface TreeListTestSetup {
    components: TreeListComponents;
    /**
     * Render a template with controlled state management (one `value` state, set by the
     * `onChangeProp` callback). Mirrors the withValueOnChange Storybook decorator.
     */
    renderWithState: (
        template: (props: any) => any,
        initialArgs?: Record<string, any>,
        options?: { onChangeProp?: string; valueExtract?: (v: any) => any },
    ) => RenderResult;
}

// ─── Templates ───────────────────────────────────────────────────

/** Toggle a value in a comma-separated list of values (multiple selection state). */
const toggleValue = (values: string, value: string) => {
    const list = values ? values.split(',') : [];
    return (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]).join(',');
};

/**
 * Create framework-agnostic JSX templates for the tree tests (the reference tree of the spec).
 * Exported so the stories can reuse the same tree.
 */
export function createTreeTemplates({ TreeList, TreeListItem, Combobox }: TreeListComponents) {
    /**
     * The reference tree:
     * Fruits (value) > Citrus (no value) > Lemon, Orange; Fruits > Apple (description).
     * Vegetables (value) > Leek, Carrot. Drinks (no value) > Lemonade, Water.
     * Snacks (value, lazy: Chips, Nuts). "Create a new list…" (no value).
     */
    const renderTree = ({
        isSelected,
        snacks,
        onOpenChange,
        onClick,
        selectionIcon,
    }: {
        isSelected: (value: string) => boolean;
        snacks?: 'loading' | 'loaded';
        onOpenChange?: (label: string, isOpen: boolean) => void;
        onClick?: (label: string) => void;
        selectionIcon?: boolean;
    }) => {
        const item = (label: string, value: string | undefined, children?: any, extra: Record<string, any> = {}) => (
            <TreeListItem
                key={label}
                label={label}
                value={value}
                isSelected={value !== undefined && isSelected(value)}
                onOpenChange={(isOpen: boolean) => onOpenChange?.(label, isOpen)}
                onClick={() => onClick?.(label)}
                after={selectionIcon ? <Combobox.SelectionIcon /> : undefined}
                {...extra}
            >
                {children}
            </TreeListItem>
        );
        let snacksChildren;
        if (snacks === 'loading') snacksChildren = <Combobox.OptionSkeleton count={2} />;
        else if (snacks === 'loaded') snacksChildren = [item('Chips', 'chips'), item('Nuts', 'nuts')];
        return [
            item('Fruits', 'fruits', [
                item('Citrus', undefined, [item('Lemon', 'lemon'), item('Orange', 'orange')]),
                item('Apple', 'apple', undefined, { description: 'Red or green' }),
            ]),
            item('Vegetables', 'vegetables', [item('Leek', 'leek'), item('Carrot', 'carrot')]),
            item('Drinks', undefined, [item('Lemonade', 'lemonade'), item('Water', 'water')]),
            item('Snacks', 'snacks', snacksChildren, { hasSubItems: true }),
            item('Create a new list…', undefined),
        ];
    };

    /**
     * Single selection tree with an input trigger.
     * `value`: `{ text, selected }` (the input text and the selected value), set with `onUpdate`.
     * `withoutState`: render no `Combobox.State`.
     */
    const inputTemplate = ({
        value,
        onUpdate,
        onSelect,
        filter,
        onOpenChange,
        onClick,
        nbOptionMessage,
        withoutState,
    }: any) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value.text}
                onChange={(text: string) => onUpdate({ ...value, text })}
                filter={filter}
                selectionMode="keep"
                onSelect={(option: { value: string }) => {
                    onSelect?.(option);
                    onUpdate({ ...value, selected: option.value });
                }}
                placeholder="Pick a food…"
                toggleButtonProps={{ label: 'Food' }}
            />
            <Combobox.Popover>
                <TreeList aria-label="Food">
                    {renderTree({ isSelected: (v) => v === value.selected, onOpenChange, onClick })}
                </TreeList>
                {!withoutState && <Combobox.State emptyMessage="No result" nbOptionMessage={nbOptionMessage} />}
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /**
     * Multiple selection tree with an input trigger.
     * `value`: `{ text, selected }` (the input text and the comma-separated selected values), set with `onUpdate`.
     */
    const multipleTemplate = ({ value, onUpdate, onOpenChange, nbOptionMessage }: any) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value.text}
                onChange={(text: string) => onUpdate({ ...value, text })}
                selectionMode="keep"
                onSelect={(option: { value: string }) =>
                    onUpdate({ ...value, selected: toggleValue(value.selected, option.value) })
                }
                placeholder="Pick foods…"
                toggleButtonProps={{ label: 'Food' }}
            />
            <Combobox.Popover>
                <TreeList aria-label="Food" aria-multiselectable>
                    {renderTree({
                        isSelected: (v) => value.selected.split(',').includes(v),
                        onOpenChange,
                        selectionIcon: true,
                    })}
                </TreeList>
                <Combobox.State emptyMessage="No result" nbOptionMessage={nbOptionMessage} />
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Single selection tree with a button trigger. */
    const buttonTemplate = ({ value, onSelect, onOpenChange }: any) => (
        <Combobox.Provider>
            <Combobox.Button label="Food" value={value} onSelect={onSelect} data-testid="combobox-button" />
            <Combobox.Popover>
                <TreeList aria-label="Food">{renderTree({ isSelected: (v) => v === value, onOpenChange })}</TreeList>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /**
     * Lazy parent item ("Snacks"): opening it starts the load (`value`: the load state).
     * The sub-items arrive when the `load` promise resolves.
     */
    const lazyTemplate = ({ value, onChange, onOpenChange, load }: any) => (
        <Combobox.Provider>
            <Combobox.Input
                value=""
                onChange={() => {}}
                placeholder="Pick a food…"
                toggleButtonProps={{ label: 'Food' }}
            />
            <Combobox.Popover>
                <TreeList aria-label="Food">
                    {renderTree({
                        isSelected: () => false,
                        snacks: value || undefined,
                        onOpenChange: (label, isOpen) => {
                            onOpenChange?.(label, isOpen);
                            if (label !== 'Snacks' || !isOpen || value) return;
                            onChange('loading');
                            load.then(() => onChange('loaded'));
                        },
                    })}
                </TreeList>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /**
     * Standalone tree (no combobox), between two buttons: the tree is its own focus owner.
     * `value`: the selected value, set with `onUpdate`.
     */
    const standaloneTemplate = ({ value, onUpdate, onSelect, onOpenChange, onClick }: any) => (
        <>
            <button type="button">Before</button>
            <TreeList
                aria-label="Food"
                onSelect={(option: { value: string }) => {
                    onSelect?.(option);
                    onUpdate(option.value);
                }}
            >
                {renderTree({ isSelected: (v) => v === value, onOpenChange, onClick })}
            </TreeList>
            <button type="button">After</button>
        </>
    );

    /**
     * Standalone tree with multiple selection and `Combobox.SelectionIcon`.
     * `value`: the comma-separated selected values, set with `onUpdate`.
     */
    const standaloneMultipleTemplate = ({ value, onUpdate }: any) => (
        <TreeList
            aria-label="Food"
            aria-multiselectable
            onSelect={(option: { value: string }) => onUpdate(toggleValue(value, option.value))}
        >
            {renderTree({ isSelected: (v) => value.split(',').includes(v), selectionIcon: true })}
        </TreeList>
    );

    return {
        inputTemplate,
        multipleTemplate,
        buttonTemplate,
        lazyTemplate,
        standaloneTemplate,
        standaloneMultipleTemplate,
    };
}

// ─── DOM Helpers ─────────────────────────────────────────────────

/** The visible tree items (role queries skip the hidden ones). */
const getTreeItemLabels = () => screen.queryAllByRole('treeitem').map((item) => item.textContent?.trim());

/** Get a visible tree item by its label. */
const getTreeItem = (label: string) => screen.getByRole('treeitem', { name: label });

/** Label of the active item (the `aria-activedescendant` of the trigger). */
const getActiveLabel = (trigger: HTMLElement) => {
    const id = trigger.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent?.trim() : undefined;
};

/** The expand toggle of a parent item (hidden from assistive technologies). */
const getToggle = (label: string) => {
    const row = getTreeItem(label).closest('.lumx-tree-list-item__row') as HTMLElement;
    return getByClassName(row, 'lumx-tree-list-item__toggle');
};

const ROOT_ITEMS = ['Fruits', 'Vegetables', 'Drinks', 'Snacks', 'Create a new list…'];

/** State of the input templates: `{ text, selected }`. */
const INPUT_STATE = { onChangeProp: 'onUpdate' };
const inputValue = (selected = '') => ({ text: '', selected });

/** State of the button template: the selected value. */
const VALUE_STATE = { onChangeProp: 'onSelect', valueExtract: (option: { value: string }) => option.value };

// ─── Test suite ──────────────────────────────────────────────────

export default function treeListTests({ components, renderWithState }: TreeListTestSetup) {
    const t = createTreeTemplates(components);

    /** Render the single selection input tree and open it. */
    const openInputTree = async ({ selected, ...initialArgs }: Record<string, any> = {}) => {
        const onOpenChange = vi.fn();
        const onClick = vi.fn();
        const onSelect = vi.fn();
        renderWithState(
            t.inputTemplate,
            { value: inputValue(selected), onOpenChange, onClick, onSelect, ...initialArgs },
            INPUT_STATE,
        );
        const input = screen.getByRole('combobox');
        await userEvent.click(input);
        await screen.findByRole('tree');
        return { input, onOpenChange, onClick, onSelect };
    };

    describe('ARIA attributes', () => {
        it('renders a tree with tree items, and a closed group per parent item', async () => {
            const { input } = await openInputTree();
            const tree = screen.getByRole('tree', { name: 'Food' });
            expect(input).toHaveAttribute('aria-haspopup', 'tree');
            expect(input).toHaveAttribute('aria-controls', tree.id);
            // Closed groups: only the root items are visible.
            expect(getTreeItemLabels()).toEqual(ROOT_ITEMS);

            const fruits = getTreeItem('Fruits');
            expect(fruits).toHaveAttribute('aria-expanded', 'false');
            const group = document.getElementById(fruits.getAttribute('aria-owns') as string) as HTMLElement;
            expect(group).toHaveAttribute('role', 'group');
            expect(group).toHaveAttribute('hidden');
            // The sub-items stay in the DOM.
            expect(within(group).getAllByRole('treeitem', { hidden: true })).toHaveLength(4);
        });

        it('sets aria-selected and data-value on the selectable tree items only', async () => {
            await openInputTree({ selected: 'fruits' });
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-selected', 'true');
            expect(getTreeItem('Fruits')).toHaveAttribute('data-value', 'fruits');
            expect(getTreeItem('Vegetables')).toHaveAttribute('aria-selected', 'false');
            for (const label of ['Drinks', 'Create a new list…']) {
                expect(getTreeItem(label)).not.toHaveAttribute('aria-selected');
                expect(getTreeItem(label)).not.toHaveAttribute('data-value');
                expect(getTreeItem(label)).not.toHaveAttribute('aria-disabled');
            }
        });

        it('has no aria-expanded and no aria-owns on a leaf item', async () => {
            await openInputTree();
            const leaf = getTreeItem('Create a new list…');
            expect(leaf).not.toHaveAttribute('aria-expanded');
            expect(leaf).not.toHaveAttribute('aria-owns');
            // A lazy parent item is a parent item before its load.
            expect(getTreeItem('Snacks')).toHaveAttribute('aria-expanded', 'false');
        });

        it('hides the expand toggle from assistive technologies', async () => {
            await openInputTree();
            const toggle = getToggle('Fruits');
            expect(toggle).toHaveAttribute('aria-hidden', 'true');
            expect(toggle).toHaveAttribute('tabindex', '-1');
        });

        it('links the description with aria-describedby', async () => {
            await openInputTree({ selected: 'apple' });
            const apple = getTreeItem('Apple');
            const [descriptionId] = (apple.getAttribute('aria-describedby') as string).split(' ');
            expect(document.getElementById(descriptionId)).toHaveTextContent('Red or green');
        });

        it('opens the ancestors of a selected sub-item at any depth', async () => {
            await openInputTree({ selected: 'lemon' });
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(getTreeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'true');
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
        });
    });

    describe('Indent', () => {
        it('sets the level of its sub-items on each group (the rows read it as an indent)', async () => {
            await openInputTree({ selected: 'lemon' });
            const groupOf = (label: string) =>
                document.getElementById(getTreeItem(label).getAttribute('aria-owns') as string) as HTMLElement;
            expect(groupOf('Fruits').style.getPropertyValue('--lumx-tree-list-level')).toBe('1');
            expect(groupOf('Citrus').style.getPropertyValue('--lumx-tree-list-level')).toBe('2');
            expect(groupOf('Vegetables').style.getPropertyValue('--lumx-tree-list-level')).toBe('1');
        });
    });

    describe('Keyboard (input trigger)', () => {
        it('opens and closes the parent items with Right and Left', async () => {
            const { input, onOpenChange } = await openInputTree();
            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveLabel(input)).toBe('Fruits');

            // Right on a closed parent item: opens it, the active item stays.
            await userEvent.keyboard('{ArrowRight}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', true);
            expect(getActiveLabel(input)).toBe('Fruits');

            // Right on an open parent item: the first sub-item.
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(input)).toBe('Citrus');

            // Left on a sub-item: the parent item.
            await userEvent.keyboard('{ArrowLeft}');
            expect(getActiveLabel(input)).toBe('Fruits');

            // Left on an open parent item: closes it.
            await userEvent.keyboard('{ArrowLeft}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', false);
            expect(onOpenChange).toHaveBeenCalledTimes(2);
        });

        it('skips the items inside a closed parent item with Down and Up', async () => {
            const { input } = await openInputTree();
            const labels = [];
            for (let i = 0; i < 5; i += 1) {
                await userEvent.keyboard('{ArrowDown}');
                labels.push(getActiveLabel(input));
            }
            expect(labels).toEqual(ROOT_ITEMS);
        });

        it('moves the active item to the parent item when it closes', async () => {
            const { input } = await openInputTree({ selected: 'lemon' });
            await userEvent.keyboard('{ArrowDown}');
            // The first selected visible item.
            expect(getActiveLabel(input)).toBe('Lemon');
            await userEvent.click(getToggle('Citrus'));
            expect(getActiveLabel(input)).toBe('Citrus');
        });

        it('selects a selectable tree item with Enter and closes the popup', async () => {
            const { input, onSelect, onClick } = await openInputTree();
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onClick).toHaveBeenCalledWith('Fruits');
            await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
        });

        it('opens and closes a non-selectable parent item with Enter (no selection)', async () => {
            const { input, onSelect, onClick, onOpenChange } = await openInputTree();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
            expect(getActiveLabel(input)).toBe('Drinks');
            await userEvent.keyboard('{Enter}');
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            expect(onClick).toHaveBeenCalledWith('Drinks');
            expect(onOpenChange).toHaveBeenLastCalledWith('Drinks', true);
            await userEvent.keyboard('{Enter}');
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
            expect(onSelect).not.toHaveBeenCalled();
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });

        it('only calls onClick on a non-selectable leaf item with Enter', async () => {
            const { input, onSelect, onClick } = await openInputTree();
            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveLabel(input)).toBe('Create a new list…');
            await userEvent.keyboard('{Enter}');
            expect(onClick).toHaveBeenCalledWith('Create a new list…');
            expect(onSelect).not.toHaveBeenCalled();
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });

        it('moves the text caret with Right and Left without an active item', async () => {
            const { onOpenChange } = await openInputTree();
            await userEvent.keyboard('{ArrowRight}{ArrowLeft}');
            expect(onOpenChange).not.toHaveBeenCalled();
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
        });
    });

    describe('Keyboard (button trigger)', () => {
        it('opens and closes the parent items with Right and Left', async () => {
            const onOpenChange = vi.fn();
            renderWithState(t.buttonTemplate, { value: '', onOpenChange }, VALUE_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Fruits'));
            expect(button).toHaveAttribute('aria-haspopup', 'tree');
            await userEvent.keyboard('{ArrowRight}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(button)).toBe('Citrus');
            await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(onOpenChange.mock.calls).toEqual([
                ['Fruits', true],
                ['Fruits', false],
            ]);
        });

        it('moves to the first and last visible tree items with Home and End', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, VALUE_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Fruits'));
            await userEvent.keyboard('{End}');
            expect(getActiveLabel(button)).toBe('Create a new list…');
            await userEvent.keyboard('{Home}');
            expect(getActiveLabel(button)).toBe('Fruits');
        });

        it('moves by 10 visible tree items with PageDown and PageUp', async () => {
            renderWithState(t.buttonTemplate, { value: 'lemon' }, VALUE_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Lemon'));
            // Visible: Fruits, Citrus, Lemon, Orange, Apple, Vegetables, Drinks, Snacks, Create a new list…
            await userEvent.keyboard('{PageDown}');
            expect(getActiveLabel(button)).toBe('Create a new list…');
            await userEvent.keyboard('{PageUp}');
            expect(getActiveLabel(button)).toBe('Fruits');
        });

        it('skips the items inside a closed parent item for typeahead', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, VALUE_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Fruits'));
            // "Citrus" and "Carrot" are inside closed parent items.
            await userEvent.keyboard('c');
            expect(getActiveLabel(button)).toBe('Create a new list…');
        });
    });

    describe('Pointer', () => {
        it('opens and closes a parent item with the expand toggle (no selection, the popup stays open)', async () => {
            const { input, onSelect, onOpenChange } = await openInputTree();
            await userEvent.click(getToggle('Fruits'));
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(getTreeItemLabels()).toEqual(['Fruits', 'Citrus', 'Apple', ...ROOT_ITEMS.slice(1)]);
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', true);
            expect(input).toHaveFocus();
            await userEvent.click(getToggle('Fruits'));
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(onSelect).not.toHaveBeenCalled();
            expect(input).toHaveAttribute('aria-expanded', 'true');
            expect(getActiveLabel(input)).toBeUndefined();
        });

        it('selects a selectable tree item on click', async () => {
            const { onSelect } = await openInputTree();
            await userEvent.click(getTreeItem('Vegetables'));
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'vegetables' }));
        });

        it('opens a non-selectable parent item on click', async () => {
            const { onSelect } = await openInputTree();
            await userEvent.click(getTreeItem('Drinks'));
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            expect(onSelect).not.toHaveBeenCalled();
        });
    });

    describe('Multiple selection', () => {
        it('renders the selection icon on the selectable tree items only', async () => {
            renderWithState(t.multipleTemplate, { value: inputValue() }, INPUT_STATE);
            await userEvent.click(screen.getByRole('combobox'));
            await screen.findByRole('tree');
            const rowOf = (label: string) => getTreeItem(label).closest('.lumx-tree-list-item__row') as HTMLElement;
            expect(queryAllByClassName(rowOf('Fruits'), 'lumx-listbox-option__selection-icon')).toHaveLength(1);
            expect(queryAllByClassName(rowOf('Drinks'), 'lumx-listbox-option__selection-icon')).toHaveLength(0);
        });
    });

    describe('Auto filter', () => {
        it('scenario "lemon": opens the ancestors of the matching items, then restores the open state', async () => {
            const nbOptionMessage = (count: number) => `${count} results`;
            renderWithState(t.multipleTemplate, { value: inputValue(), nbOptionMessage }, INPUT_STATE);
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree');
            // No count without a filter.
            expect(screen.queryByText(/results/)).not.toBeInTheDocument();

            await userEvent.type(input, 'lemon');
            expect(getTreeItemLabels()).toEqual(['Fruits', 'Citrus', 'Lemon', 'Drinks', 'Lemonade']);
            for (const label of ['Fruits', 'Citrus', 'Drinks']) {
                expect(getTreeItem(label)).toHaveAttribute('aria-expanded', 'true');
            }
            expect(await screen.findByText('2 results')).toBeInTheDocument();

            // Select "Lemon", then clear the filter.
            await userEvent.click(getTreeItem('Lemon'));
            await waitFor(() => expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'true'));
            await userEvent.clear(input);
            await waitFor(() => expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true'));
            expect(getTreeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
            expect(screen.queryByText(/results/)).not.toBeInTheDocument();
        });

        it('scenario "veg": a matching parent item stays closed, and the user can open it', async () => {
            const onOpenChange = vi.fn();
            const nbOptionMessage = (count: number) => `${count} results`;
            renderWithState(t.multipleTemplate, { value: inputValue(), onOpenChange, nbOptionMessage }, INPUT_STATE);
            const input = screen.getByRole('combobox');
            await userEvent.type(input, 'veg');
            await screen.findByRole('tree');
            expect(getTreeItemLabels()).toEqual(['Vegetables']);
            expect(getTreeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false');
            expect(await screen.findByText('1 results')).toBeInTheDocument();

            await userEvent.keyboard('{ArrowDown}{ArrowRight}');
            expect(onOpenChange).toHaveBeenLastCalledWith('Vegetables', true);
            expect(getTreeItemLabels()).toEqual(['Vegetables', 'Leek', 'Carrot']);

            await userEvent.clear(input);
            await waitFor(() => expect(getTreeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false'));
            expect(getTreeItemLabels()).toEqual(ROOT_ITEMS);
        });

        it('keeps the active item when a selection clears the filter', async () => {
            renderWithState(t.multipleTemplate, { value: inputValue() }, INPUT_STATE);
            const input = screen.getByRole('combobox');
            await userEvent.type(input, 'lemon');
            await screen.findByRole('tree');
            await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
            expect(getActiveLabel(input)).toBe('Lemon');
            // The selection clears the filter: the ancestors of "Lemon" stay open, "Lemon" stays active.
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'true'));
            expect(getTreeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(getActiveLabel(input)).toBe('Lemon');
        });

        it('moves the active item to the parent item when the filter clear closes its group', async () => {
            renderWithState(t.multipleTemplate, { value: inputValue('lemonade') }, INPUT_STATE);
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree');
            // "Drinks" starts open (selected sub-item): close it.
            await userEvent.click(getToggle('Drinks'));
            await userEvent.type(input, 'lemon');
            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveLabel(input)).toBe('Lemonade');
            // Deselect "Lemonade": the filter clears, "Drinks" goes back to closed.
            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false'));
            expect(getActiveLabel(input)).toBe('Drinks');
        });

        it('matches on the description of a tree item', async () => {
            const { input } = await openInputTree();
            await userEvent.type(input, 'green');
            expect(getTreeItemLabels()).toEqual(['Fruits', 'Apple']);
        });

        it('shows the empty state when no tree item matches', async () => {
            const { input } = await openInputTree();
            await userEvent.type(input, 'xyz');
            expect(getTreeItemLabels()).toEqual([]);
            expect(await screen.findByText('No result')).toBeInTheDocument();
        });
    });

    describe('Manual filter', () => {
        it('opens every parent item with rendered sub-items while the input text is not empty', async () => {
            const { input, onOpenChange } = await openInputTree({ filter: 'manual' });
            await userEvent.type(input, 'veg');
            // Nothing is hidden: the consumer renders the result.
            expect(getTreeItemLabels()).toContain('Lemonade');
            for (const label of ['Fruits', 'Citrus', 'Vegetables', 'Drinks']) {
                expect(getTreeItem(label)).toHaveAttribute('aria-expanded', 'true');
            }
            // A lazy parent item with no sub-items stays closed.
            expect(getTreeItem('Snacks')).toHaveAttribute('aria-expanded', 'false');
            expect(onOpenChange).not.toHaveBeenCalled();
            await userEvent.clear(input);
            // The open state goes back on the next frame.
            await waitFor(() => expect(getTreeItemLabels()).toEqual(ROOT_ITEMS));
        });
    });

    describe('Standalone tree', () => {
        /** Render the standalone tree between two buttons, and focus the "Before" button. */
        const setupStandalone = (initialArgs: Record<string, any> = {}) => {
            const onOpenChange = vi.fn();
            const onClick = vi.fn();
            const onSelect = vi.fn();
            renderWithState(
                t.standaloneTemplate,
                { value: '', onOpenChange, onClick, onSelect, ...initialArgs },
                { onChangeProp: 'onUpdate' },
            );
            screen.getByRole('button', { name: 'Before' }).focus();
            return { tree: screen.getByRole('tree', { name: 'Food' }), onOpenChange, onClick, onSelect };
        };

        it('renders a focusable tree with non-focusable tree items, always open', () => {
            const { tree } = setupStandalone();
            expect(tree).toHaveAttribute('tabindex', '0');
            expect(tree).not.toHaveAttribute('aria-busy');
            expect(getTreeItemLabels()).toEqual(ROOT_ITEMS);
            for (const item of within(tree).getAllByRole('treeitem')) expect(item).toHaveAttribute('tabindex', '-1');
        });

        it('is a single tab stop, and shows the first tree item on focus', async () => {
            const { tree } = setupStandalone();
            await userEvent.tab();
            expect(tree).toHaveFocus();
            expect(getActiveLabel(tree)).toBe('Fruits');
            await userEvent.tab();
            expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
        });

        it('shows the selected tree item on focus (its ancestors are open)', async () => {
            const { tree } = setupStandalone({ value: 'lemon' });
            await userEvent.tab();
            expect(getActiveLabel(tree)).toBe('Lemon');
        });

        it('moves with the arrows, Home, End and typeahead, and opens and closes with Right and Left', async () => {
            const { tree, onOpenChange } = setupStandalone();
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveLabel(tree)).toBe('Vegetables');
            await userEvent.keyboard('{ArrowRight}');
            expect(getTreeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            expect(onOpenChange).toHaveBeenLastCalledWith('Vegetables', true);
            expect(getActiveLabel(tree)).toBe('Vegetables');
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(tree)).toBe('Leek');
            await userEvent.keyboard('{ArrowLeft}');
            expect(getActiveLabel(tree)).toBe('Vegetables');
            await userEvent.keyboard('{ArrowLeft}');
            expect(getTreeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false');
            expect(onOpenChange).toHaveBeenLastCalledWith('Vegetables', false);
            await userEvent.keyboard('{End}');
            expect(getActiveLabel(tree)).toBe('Create a new list…');
            await userEvent.keyboard('{Home}');
            expect(getActiveLabel(tree)).toBe('Fruits');
            // "Citrus" and "Carrot" are inside closed parent items.
            await userEvent.keyboard('c');
            expect(getActiveLabel(tree)).toBe('Create a new list…');
        });

        it('calls onSelect with Enter, Space and a click', async () => {
            const { tree, onSelect, onClick } = setupStandalone();
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
            expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onClick).toHaveBeenLastCalledWith('Fruits');
            await waitFor(() => expect(getTreeItem('Fruits')).toHaveAttribute('aria-selected', 'true'));
            await userEvent.keyboard('{ArrowDown}[Space]');
            expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'vegetables' }));
            await userEvent.click(getTreeItem('Snacks'));
            expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'snacks' }));
            expect(onSelect).toHaveBeenCalledTimes(3);
            // The clicked tree item is the active item, and the tree keeps the focus.
            expect(tree).toHaveFocus();
            expect(getActiveLabel(tree)).toBe('Snacks');
        });

        it('opens and closes a non-selectable parent item with Enter and a click (no selection)', async () => {
            const { tree, onSelect, onClick, onOpenChange } = setupStandalone();
            await userEvent.tab();
            await userEvent.keyboard('{ArrowDown}{ArrowDown}');
            expect(getActiveLabel(tree)).toBe('Drinks');
            await userEvent.keyboard('{Enter}');
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            expect(onClick).toHaveBeenLastCalledWith('Drinks');
            expect(onOpenChange).toHaveBeenLastCalledWith('Drinks', true);
            await userEvent.click(getToggle('Drinks'));
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
            expect(onSelect).not.toHaveBeenCalled();
            expect(tree).toHaveFocus();
        });

        it('clears the active item on focus out', async () => {
            const { tree } = setupStandalone();
            await userEvent.tab();
            expect(getActiveLabel(tree)).toBe('Fruits');
            await userEvent.tab();
            expect(getActiveLabel(tree)).toBeUndefined();
        });

        it('toggles the selection in a multiple selection tree, with the selection icon', async () => {
            renderWithState(t.standaloneMultipleTemplate, { value: 'lemon' }, { onChangeProp: 'onUpdate' });
            const tree = screen.getByRole('tree', { name: 'Food' });
            expect(tree).toHaveAttribute('aria-multiselectable', 'true');
            const rowOf = (label: string) => getTreeItem(label).closest('.lumx-tree-list-item__row') as HTMLElement;
            expect(queryAllByClassName(rowOf('Lemon'), 'lumx-listbox-option__selection-icon')).toHaveLength(1);
            expect(queryAllByClassName(rowOf('Citrus'), 'lumx-listbox-option__selection-icon')).toHaveLength(0);
            await userEvent.click(getTreeItem('Orange'));
            await waitFor(() => expect(getTreeItem('Orange')).toHaveAttribute('aria-selected', 'true'));
            expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'true');
            await userEvent.click(getTreeItem('Lemon'));
            await waitFor(() => expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'false'));
        });
    });

    describe('Lazy parent item', () => {
        it('loads its sub-items when the user opens it', async () => {
            const onOpenChange = vi.fn();
            let finishLoad = () => {};
            const load = new Promise<void>((resolve) => {
                finishLoad = resolve;
            });
            renderWithState(t.lazyTemplate, { value: '', onOpenChange, load }, { onChangeProp: 'onChange' });
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            const tree = await screen.findByRole('tree');
            await userEvent.keyboard('{ArrowUp}{ArrowUp}');
            expect(getActiveLabel(input)).toBe('Snacks');

            await userEvent.keyboard('{ArrowRight}');
            expect(onOpenChange).toHaveBeenLastCalledWith('Snacks', true);
            const snacks = getTreeItem('Snacks');
            expect(snacks).toHaveAttribute('aria-expanded', 'true');
            const group = document.getElementById(snacks.getAttribute('aria-owns') as string) as HTMLElement;
            // Only skeletons: the group is busy, the tree is not.
            expect(queryAllByClassName(group, SKELETON_CLASSNAME)).toHaveLength(2);
            await waitFor(() => expect(group).toHaveAttribute('aria-busy', 'true'));
            expect(tree).not.toHaveAttribute('aria-busy');
            // Nothing to move to yet.
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(input)).toBe('Snacks');

            finishLoad();
            await screen.findByRole('treeitem', { name: 'Chips' });
            await waitFor(() => expect(group).not.toHaveAttribute('aria-busy'));
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(input)).toBe('Chips');
        });
    });
}
