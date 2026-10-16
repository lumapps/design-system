/**
 * Browser-only test stories for the TreeList (in a combobox).
 *
 * These tests need a real browser (Playwright via Vitest browser mode): real pointer events and
 * focus, and the accessibility check (axe, from the Storybook a11y addon in `error` mode).
 *
 * The other tree tests run in jsdom (see Tests.tsx).
 */
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getByClassName } from '../../../testing/queries';
import { COMBOBOX_POPOVER_CLASSNAME } from '../Combobox/constants';
import { Icon } from '../Icon';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from './TreeListItem';
import { createTreeTemplates, type TreeListComponents } from './Tests';

/** Fail the story test on any accessibility violation (axe runs after the play function). */
const A11Y_ERROR = { a11y: { test: 'error' } };

/** The row of a tree item element. */
const getRow = (treeItem: HTMLElement) => treeItem.closest(`.${TREE_LIST_ITEM_CLASSNAME}__row`) as HTMLElement;

/** The expand toggle of a row (a button hidden from assistive technologies). */
const getToggle = (row: HTMLElement) => within(row).getByRole('button', { hidden: true });

export function setup({
    components,
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: TreeListComponents;
    decorators: 'withValueOnChange';
}>) {
    const templates = createTreeTemplates(components);
    const INPUT_STATE = {
        args: { value: { text: '', selected: 'apple' } },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
    };

    const meta = {
        component: components.TreeList,
    };

    /**
     * The layout of the tree item rows (real styles): the indent, the chevron size and the row height. (The
     * keyboard and pointer behavior is tested in jsdom, see Tests.tsx.)
     */
    const TreeItemRowLayout = {
        ...INPUT_STATE,
        render: templates.inputTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            const vegetables = await screen.findByRole('treeitem', { name: 'Vegetables' });
            const row = getRow(vegetables);
            const toggle = getToggle(row);
            await userEvent.click(toggle);
            // Indent: one big spacing unit (16px) of left padding per level, on the row (full width background).
            const rowPadding = (label: string) =>
                getComputedStyle(getRow(screen.getByRole('treeitem', { name: label }))).paddingLeft;
            await expect(rowPadding('Vegetables')).toBe('0px');
            await expect(rowPadding('Carrot')).toBe('16px');
            // The chevron is bigger than the default icon of a size `s` icon button (20px instead of 16px).
            const chevron = getByClassName(toggle, Icon.className as string);
            await expect(getComputedStyle(chevron).width).toBe('20px');
            // The toggle does not make the row taller than a list item of size `tiny` (36px).
            await expect(row.getBoundingClientRect().height).toBe(36);
        },
    };

    /**
     * Non-selectable parent item: the expand toggle is the main action of the row. A click on the label
     * goes to the toggle overlay (browser hit testing). (The toggle click itself is tested in jsdom, see Tests.tsx.)
     */
    const ClickNonSelectableParentItemRow = {
        ...INPUT_STATE,
        render: templates.inputTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            const drinks = await screen.findByRole('treeitem', { name: 'Drinks' });
            const toggle = getToggle(getRow(drinks));
            // The element under the label is the toggle (its overlay), not the row action.
            const label = within(drinks).getByText('Drinks');
            const { x, y, width, height } = label.getBoundingClientRect();
            await expect(document.elementFromPoint(x + width / 2, y + height / 2)).toBe(toggle);

            // A selectable parent item: the row button stays the target (a click selects it).
            const fruits = screen.getByRole('treeitem', { name: 'Fruits' });
            const fruitsBox = fruits.getBoundingClientRect();
            await expect(
                document.elementFromPoint(fruitsBox.x + fruitsBox.width / 2, fruitsBox.y + fruitsBox.height / 2),
            ).toBe(fruits);
        },
    };

    /**
     * Auto filter without `Combobox.State`: when no tree item matches, the filter hides every tree item and the
     * popover hides (like an empty listbox). Real styles only: the `hidden` tree and the input `aria-expanded`
     * are tested in jsdom (see Tests.tsx).
     */
    const FilterNoMatchHidesPopover = {
        ...INPUT_STATE,
        // A skeleton in the group of "Snacks": it stays in the DOM when the filter hides "Snacks".
        args: { ...INPUT_STATE.args, withoutState: true, snacks: 'loading' },
        render: templates.inputTemplate,
        async play() {
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            const tree = await screen.findByRole('tree', { name: 'Food' });
            const popover = getByClassName(document.body, COMBOBOX_POPOVER_CLASSNAME);
            await expect(getComputedStyle(popover).display).not.toBe('none');

            await userEvent.type(input, 'zzz');
            await waitFor(() => expect(getComputedStyle(popover).display).toBe('none'));
            await expect(getComputedStyle(tree).display).toBe('none');
        },
    };

    /** axe on the open tree: an open parent item, a selected sub-item, non-selectable items, a description. */
    const AccessibilityOpenTree = {
        ...INPUT_STATE,
        parameters: A11Y_ERROR,
        render: templates.inputTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            const fruits = await screen.findByRole('treeitem', { name: 'Fruits' });
            await expect(fruits).toHaveAttribute('aria-expanded', 'true');
            await userEvent.keyboard('{ArrowDown}');
        },
    };

    /** axe on a tree with a loading group (skeletons inside a group), and its loading message. */
    const AccessibilityLoadingGroup = {
        args: { value: '', load: new Promise(() => {}) },
        decorators: [withValueOnChange()],
        parameters: A11Y_ERROR,
        render: templates.lazyTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowRight}');
            const snacks = await screen.findByRole('treeitem', { name: 'Snacks' });
            const group = document.getElementById(snacks.getAttribute('aria-owns') as string);
            await waitFor(() => expect(group).toHaveAttribute('aria-busy', 'true'));
            // The loading message of the live region, after its delay (the skeletons are in a group).
            await expect(await screen.findByText('Loading snacks…')).toBeInTheDocument();
        },
    };

    /** axe on a standalone tree with an open parent item and a selected sub-item. */
    const AccessibilityStandaloneTree = {
        args: { value: 'lemon' },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
        parameters: A11Y_ERROR,
        render: templates.standaloneTemplate,
        async play() {
            await userEvent.tab();
            await userEvent.tab();
            await expect(screen.getByRole('tree', { name: 'Food' })).toHaveFocus();
        },
    };

    return {
        meta,
        TreeItemRowLayout,
        ClickNonSelectableParentItemRow,
        FilterNoMatchHidesPopover,
        AccessibilityOpenTree,
        AccessibilityLoadingGroup,
        AccessibilityStandaloneTree,
    };
}
