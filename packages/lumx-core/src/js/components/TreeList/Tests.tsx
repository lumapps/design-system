/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/dom';
import { queryAllByClassName } from '../../../testing/queries';
import { CLASSNAME as SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from './TreeListItem';

// ─── Types ───────────────────────────────────────────────────────

/** Combobox components used by the tree tests (the shared list sub-components work in a tree too). */
export interface TreeListComboboxNamespace {
    Provider: any;
    Input: any;
    Button: any;
    Popover: any;
    OptionSkeleton: any;
    State: any;
    List: any;
    Option: any;
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

/**
 * Create framework-agnostic JSX templates for the tree tests (the reference tree of the spec).
 * Exported so the test stories can reuse the same tree.
 */
export function createTreeTemplates({ TreeList, TreeListItem, Combobox }: TreeListComponents) {
    /**
     * The reference tree:
     * Fruits (value) > Citrus (no value) > Lemon, Orange; Fruits > Apple (description).
     * Vegetables (value) > Leek, Carrot. Drinks (no value) > Lemonade, Water.
     * Snacks (value, lazy: Chips, Nuts). "Create a new list…" (no value).
     */
    const renderTree = ({
        snacks,
        onOpenChange,
        onClick,
    }: {
        snacks?: 'loading' | 'loaded';
        onOpenChange?: (label: string, isOpen: boolean) => void;
        onClick?: (label: string) => void;
    }) => {
        const item = (label: string, value: string | undefined, children?: any, extra: Record<string, any> = {}) => (
            <TreeListItem
                key={label}
                label={label}
                value={value}
                onOpenChange={(isOpen: boolean) => onOpenChange?.(label, isOpen)}
                onClick={() => onClick?.(label)}
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
     * Tree with an input trigger.
     * `value`: `{ text, selected }` (the input text and the selected value, or values with
     * `selectionType="multiple"`), set with `onUpdate`.
     * `withoutState`: render no `Combobox.State`.
     * `snacks`: the sub-items of "Snacks" (see `renderTree`).
     */
    const inputTemplate = ({
        value,
        onUpdate,
        onSelect,
        treeOnSelect,
        filter,
        selectionType,
        onOpenChange,
        onClick,
        nbOptionMessage,
        withoutState,
        snacks,
    }: any) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value.text}
                onChange={(text: string) => onUpdate({ ...value, text })}
                filter={filter}
                selectionMode="keep"
                onSelect={onSelect}
                placeholder="Pick a food…"
                toggleButtonProps={{ label: 'Food' }}
            />
            <Combobox.Popover>
                <TreeList
                    aria-label="Food"
                    selectionType={selectionType}
                    value={value.selected}
                    onChange={(selected: string | string[]) => onUpdate({ ...value, selected })}
                    onSelect={treeOnSelect}
                >
                    {renderTree({ snacks, onOpenChange, onClick })}
                </TreeList>
                {!withoutState && <Combobox.State emptyMessage="No result" nbOptionMessage={nbOptionMessage} />}
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Single selection tree with a button trigger. */
    const buttonTemplate = ({ value, onSelect, onOpenChange }: any) => (
        <Combobox.Provider>
            <Combobox.Button label="Food" value={value} onSelect={onSelect} data-testid="combobox-button" />
            <Combobox.Popover>
                <TreeList aria-label="Food" value={value}>
                    {renderTree({ onOpenChange })}
                </TreeList>
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
                        snacks: value || undefined,
                        onOpenChange: (label, isOpen) => {
                            onOpenChange?.(label, isOpen);
                            if (label !== 'Snacks' || !isOpen || value) return;
                            onChange('loading');
                            load.then(() => onChange('loaded'));
                        },
                    })}
                </TreeList>
                <Combobox.State loadingMessage="Loading snacks…" />
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /**
     * Standalone tree (no combobox), between two buttons: the tree is its own focus owner.
     * `value`: the selected value (or values with `selectionType="multiple"`), set with `onUpdate`.
     */
    const standaloneTemplate = ({ value, onUpdate, onSelect, onOpenChange, onClick, selectionType }: any) => (
        <>
            <button type="button">Before</button>
            <TreeList
                aria-label="Food"
                selectionType={selectionType}
                value={value}
                onChange={onUpdate}
                onSelect={onSelect}
            >
                {renderTree({ onOpenChange, onClick })}
            </TreeList>
            <button type="button">After</button>
        </>
    );

    return {
        inputTemplate,
        buttonTemplate,
        lazyTemplate,
        standaloneTemplate,
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

/** The row of a visible tree item. */
const getRow = (label: string) => getTreeItem(label).closest(`.${TREE_LIST_ITEM_CLASSNAME}__row`) as HTMLElement;

/** The expand toggle of a parent item (a button hidden from assistive technologies). */
const getToggle = (label: string) => within(getRow(label)).getByRole('button', { hidden: true });

const ROOT_ITEMS = ['Fruits', 'Vegetables', 'Drinks', 'Snacks', 'Create a new list…'];

/** State of the input templates: `{ text, selected }` (the selected value, or values in the multiple template). */
const INPUT_STATE = { onChangeProp: 'onUpdate' };
const inputValue = (selected = '') => ({ text: '', selected });
const multipleValue = (selected: string[] = []) => ({ text: '', selected });

/** State of the button template: the selected value. */
const VALUE_STATE = { onChangeProp: 'onSelect', valueExtract: (option: { value: string }) => option.value };

// ─── Test suite ──────────────────────────────────────────────────

export default function treeListTests({ components, renderWithState }: TreeListTestSetup) {
    const templates = createTreeTemplates(components);

    /** Render the single selection input tree and open it. */
    const openInputTree = async ({ selected, ...initialArgs }: Record<string, any> = {}) => {
        const onOpenChange = vi.fn();
        const onClick = vi.fn();
        const onSelect = vi.fn();
        renderWithState(
            templates.inputTemplate,
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

    describe('Keyboard (input trigger)', () => {
        it('opens and closes the parent items with Right and Left', async () => {
            // The navigation rules are in setupTreeList.test.ts: here, the keys from the input reach the tree item.
            const { onOpenChange } = await openInputTree();
            await userEvent.keyboard('{ArrowDown}{ArrowRight}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', true);
            await userEvent.keyboard('{ArrowLeft}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', false);
        });

        it('selects a selectable tree item with Enter and closes the popup', async () => {
            const treeOnSelect = vi.fn();
            const { input, onSelect, onClick } = await openInputTree({ treeOnSelect });
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onClick).toHaveBeenCalledWith('Fruits');
            // In a combobox, the trigger onSelect handles the selection, not the tree onSelect.
            expect(treeOnSelect).not.toHaveBeenCalled();
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
            const { input, onOpenChange } = await openInputTree();
            // Typing clears the active item.
            await userEvent.type(input, 'fr');
            expect(getActiveLabel(input)).toBeUndefined();
            await userEvent.keyboard('{ArrowLeft}');
            expect((input as HTMLInputElement).selectionStart).toBe(1);
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            await userEvent.keyboard('{ArrowRight}');
            expect((input as HTMLInputElement).selectionStart).toBe(2);
            expect(onOpenChange).not.toHaveBeenCalled();
        });

        it('opens the tooltip of the active tree item', async () => {
            const { TreeList, TreeListItem, Combobox } = components;
            renderWithState(() => (
                <Combobox.Provider>
                    <Combobox.Input value="" onChange={() => {}} toggleButtonProps={{ label: 'Food' }} />
                    <Combobox.Popover>
                        <TreeList aria-label="Food">
                            <TreeListItem label="Fruits" value="fruits" tooltipProps={{ label: 'Fruits info' }} />
                            <TreeListItem
                                label="Vegetables"
                                value="vegetables"
                                tooltipProps={{ label: 'Vegetables info' }}
                            />
                        </TreeList>
                    </Combobox.Popover>
                </Combobox.Provider>
            ));
            await userEvent.click(screen.getByRole('combobox'));
            await screen.findByRole('tree');
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await userEvent.keyboard('{ArrowDown}');
            expect(await screen.findByRole('tooltip', { name: 'Fruits info' })).toBeInTheDocument();
            expect(screen.queryByRole('tooltip', { name: 'Vegetables info' })).not.toBeInTheDocument();

            await userEvent.keyboard('{ArrowDown}');
            expect(await screen.findByRole('tooltip', { name: 'Vegetables info' })).toBeInTheDocument();
            await waitFor(() => expect(screen.queryByRole('tooltip', { name: 'Fruits info' })).not.toBeInTheDocument());
        });
    });

    describe('Keyboard (button trigger)', () => {
        // The tree navigation does not depend on the trigger (see the input trigger tests).
        it('opens the tree popup on ArrowDown, with the first tree item active', async () => {
            renderWithState(templates.buttonTemplate, { value: '' }, VALUE_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Fruits'));
            // From the mounted tree (Vue mounts it when the popup opens).
            expect(button).toHaveAttribute('aria-haspopup', 'tree');
            expect(button).toHaveAttribute('aria-expanded', 'true');
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
    });

    describe('Auto filter', () => {
        it('scenario "lemon": shows the matching items with their open ancestors, and their count', async () => {
            const nbOptionMessage = (count: number) => `${count} results`;
            const { input } = await openInputTree({ nbOptionMessage });
            // No count without a filter.
            expect(screen.queryByText(/results/)).not.toBeInTheDocument();

            await userEvent.type(input, 'lemon');
            expect(getTreeItemLabels()).toEqual(['Fruits', 'Citrus', 'Lemon', 'Drinks', 'Lemonade']);
            for (const label of ['Fruits', 'Citrus', 'Drinks']) {
                expect(getTreeItem(label)).toHaveAttribute('aria-expanded', 'true');
            }
            expect(await screen.findByText('2 results')).toBeInTheDocument();
        });

        it('hides the tree when the filter hides every tree item, also with a skeleton in a group', async () => {
            const { input } = await openInputTree({ snacks: 'loading' });
            const tree = screen.getByRole('tree');
            expect(tree).not.toHaveAttribute('hidden');

            await userEvent.type(input, 'zzz');
            await waitFor(() => expect(tree).toHaveAttribute('hidden'));
            // The skeleton in the group of the hidden "Snacks" is not visible content.
            expect(input).toHaveAttribute('aria-expanded', 'false');
            expect(getTreeItemLabels()).toEqual([]);
            expect(await screen.findByText('No result')).toBeInTheDocument();

            await userEvent.clear(input);
            await waitFor(() => expect(tree).not.toHaveAttribute('hidden'));
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });

        it('keeps the active item when a selection clears the filter', async () => {
            renderWithState(
                templates.inputTemplate,
                { value: multipleValue(), selectionType: 'multiple' },
                INPUT_STATE,
            );
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
            // "Drinks" was only open for the filter: back to closed.
            await waitFor(() => expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'false'));
        });

        it('moves the active item to the parent item when the filter clear closes its group', async () => {
            const { input } = await openInputTree({ selectionType: 'multiple', selected: ['lemonade'] });
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
    });

    describe('Manual filter', () => {
        it('opens every parent item with rendered sub-items while the input text is not empty', async () => {
            const { input, onOpenChange } = await openInputTree({ filter: 'manual' });
            await userEvent.type(input, 'veg');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            // Not a user action: no onOpenChange.
            expect(onOpenChange).not.toHaveBeenCalled();
            await userEvent.clear(input);
            // The open state goes back on the next frame.
            await waitFor(() => expect(getTreeItemLabels()).toEqual(ROOT_ITEMS));
        });

        it('clears the manual filter on a selection (the input text stays)', async () => {
            const { input } = await openInputTree({ filter: 'manual', selectionType: 'multiple', selected: [] });
            await userEvent.type(input, 'veg');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            await userEvent.click(getTreeItem('Carrot'));
            expect(input).toHaveValue('veg');
            // The parent items only open for the filter go back to closed, the ancestors of the selection stay open.
            await waitFor(() => expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false'));
            expect(getTreeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
        });

        it('applies the typed manual filter again when the popup opens again', async () => {
            const { input } = await openInputTree({ filter: 'manual' });
            await userEvent.type(input, 'veg');
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'false'));
            expect(input).toHaveValue('veg');
            // Reopen (Vue mounts the tree again): the tree gets the typed text again.
            await userEvent.click(screen.getByRole('button', { name: 'Food' }));
            await screen.findByRole('tree');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
        });
    });

    describe('Standalone tree', () => {
        /** Render the standalone tree between two buttons, and focus the "Before" button. */
        const setupStandalone = (initialArgs: Record<string, any> = {}) => {
            const onOpenChange = vi.fn();
            const onClick = vi.fn();
            const onSelect = vi.fn();
            renderWithState(
                templates.standaloneTemplate,
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

        it('opens and closes a parent item with Right and Left (keys on the tree)', async () => {
            const { onOpenChange } = setupStandalone();
            await userEvent.tab();
            await userEvent.keyboard('{ArrowRight}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(onOpenChange).toHaveBeenLastCalledWith('Fruits', true);
            await userEvent.keyboard('{ArrowLeft}');
            expect(getTreeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
        });

        it('calls onSelect with Enter', async () => {
            const { onSelect, onClick } = setupStandalone();
            await userEvent.tab();
            await userEvent.keyboard('{Enter}');
            expect(onSelect).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onClick).toHaveBeenLastCalledWith('Fruits');
            await waitFor(() => expect(getTreeItem('Fruits')).toHaveAttribute('aria-selected', 'true'));
        });

        it('opens a non-selectable parent item with a click on its expand toggle (no selection)', async () => {
            const { tree, onSelect } = setupStandalone();
            await userEvent.click(getToggle('Drinks'));
            expect(getTreeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            // The main expand toggle: the tree takes the focus, its tree item is the active item.
            expect(tree).toHaveFocus();
            expect(getActiveLabel(tree)).toBe('Drinks');
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('calls onChange with the selected value (single selection)', async () => {
            const onUpdate = vi.fn();
            setupStandalone({ value: 'lemon', onUpdate });
            await userEvent.click(getTreeItem('Vegetables'));
            expect(onUpdate).toHaveBeenLastCalledWith('vegetables');
            await waitFor(() => expect(getTreeItem('Vegetables')).toHaveAttribute('aria-selected', 'true'));
            expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'false');
        });

        it('calls onChange with the toggled values (multiple selection)', async () => {
            const onUpdate = vi.fn();
            renderWithState(
                templates.standaloneTemplate,
                { value: ['lemon'], selectionType: 'multiple', onUpdate },
                { onChangeProp: 'onUpdate' },
            );
            expect(screen.getByRole('tree', { name: 'Food' })).toHaveAttribute('aria-multiselectable', 'true');
            await userEvent.click(getTreeItem('Orange'));
            expect(onUpdate).toHaveBeenLastCalledWith(['lemon', 'orange']);
            await waitFor(() => expect(getTreeItem('Orange')).toHaveAttribute('aria-selected', 'true'));
            expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'true');
            // The icon follows the selected state.
            await userEvent.click(getTreeItem('Lemon'));
            expect(onUpdate).toHaveBeenLastCalledWith(['orange']);
            await waitFor(() => expect(getTreeItem('Lemon')).toHaveAttribute('aria-selected', 'false'));
        });
    });

    describe('Parent adaptation', () => {
        it('uses the id prop on a standalone tree', () => {
            const { TreeList, TreeListItem } = components;
            renderWithState(() => (
                <TreeList aria-label="Food" id="food-tree">
                    <TreeListItem label="Fruits" />
                </TreeList>
            ));
            expect(screen.getByRole('tree')).toHaveAttribute('id', 'food-tree');
        });

        it('ignores the id prop in a combobox (the trigger controls the combobox list ID)', async () => {
            const { TreeList, TreeListItem, Combobox } = components;
            renderWithState(() => (
                <Combobox.Provider>
                    <Combobox.Button label="Food" />
                    <Combobox.Popover>
                        <TreeList aria-label="Food" id="food-tree">
                            <TreeListItem label="Fruits" value="fruits" />
                        </TreeList>
                    </Combobox.Popover>
                </Combobox.Provider>
            ));
            await userEvent.click(screen.getByRole('combobox'));
            const tree = await screen.findByRole('tree');
            expect(tree.id).not.toBe('food-tree');
        });

        it('stays standalone inside a combobox list (the nearest parent wins)', async () => {
            const { TreeList, TreeListItem, Combobox } = components;
            renderWithState(() => (
                <Combobox.Provider>
                    <Combobox.Button label="Fruits" />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Fruits">
                            <Combobox.Option value="apple">Apple</Combobox.Option>
                            <li>
                                <TreeList aria-label="Food">
                                    <TreeListItem label="Fruits" value="fruits" />
                                </TreeList>
                            </li>
                        </Combobox.List>
                    </Combobox.Popover>
                </Combobox.Provider>
            ));
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            const tree = await screen.findByRole('tree');
            // The combobox list stays the listbox, and the tree is its own focus owner.
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
            expect(button).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
            expect(tree).toHaveAttribute('tabindex', '0');
            expect(screen.getByRole('treeitem', { name: 'Fruits' })).toBeInTheDocument();
        });

        it('warns and stays inert as a tree item in another composite (e.g. a combobox list)', async () => {
            const { TreeListItem, Combobox } = components;
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            renderWithState(() => (
                <Combobox.Provider>
                    <Combobox.Button label="Fruits" />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Fruits">
                            <TreeListItem label="Fruits" value="fruits" />
                        </Combobox.List>
                    </Combobox.Popover>
                </Combobox.Provider>
            ));
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            await waitFor(() =>
                expect(warn).toHaveBeenCalledWith(
                    expect.stringContaining('TreeListItem must be used within a TreeList'),
                ),
            );
            // Never registered: the keyboard navigation never reaches it.
            await userEvent.keyboard('{ArrowDown}');
            const item = screen.getByRole('treeitem', { name: 'Fruits', hidden: true });
            expect(item.id).not.toBe('');
            expect(button).not.toHaveAttribute('aria-activedescendant', item.id);
            warn.mockRestore();
        });
    });

    describe('Lazy parent item', () => {
        it('loads its sub-items when the user opens it', async () => {
            const onOpenChange = vi.fn();
            let finishLoad = () => {};
            const load = new Promise<void>((resolve) => {
                finishLoad = resolve;
            });
            renderWithState(templates.lazyTemplate, { value: '', onOpenChange, load }, { onChangeProp: 'onChange' });
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
            // Only skeletons, in a group: the tree is not busy (nested skeletons).
            expect(queryAllByClassName(group, SKELETON_CLASSNAME)).toHaveLength(2);
            expect(tree).not.toHaveAttribute('aria-busy');
            // Nothing to move to yet.
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(input)).toBe('Snacks');

            finishLoad();
            await screen.findByRole('treeitem', { name: 'Chips' });
            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveLabel(input)).toBe('Chips');
        });
    });
}
