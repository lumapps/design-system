/**
 * Browser-only test stories for the TreeList (in a combobox).
 *
 * These tests need a real browser (Playwright via Vitest browser mode): real pointer events and
 * focus, and the accessibility check (axe, from the Storybook a11y addon in `error` mode).
 *
 * The other tree tests run in jsdom (see Tests.tsx).
 */
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getByClassName } from '../../../testing/queries';
import { createTreeTemplates, type TreeListComponents } from './Tests';

/** Fail the story test on any accessibility violation (axe runs after the play function). */
const A11Y_ERROR = { a11y: { test: 'error' } };

/** The visible tree items (role queries skip the hidden ones). */
const getTreeItemLabels = () => screen.queryAllByRole('treeitem').map((item) => item.textContent?.trim());

export function setup({
    components,
    decorators: { withValueOnChange },
}: SetupStoriesOptions<{
    components: TreeListComponents;
    decorators: 'withValueOnChange';
}>) {
    const t = createTreeTemplates(components);
    const INPUT_STATE = {
        args: { value: { text: '', selected: 'apple' } },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
    };

    const meta = {
        component: components.TreeList,
    };

    /** A real click on the expand toggle keeps the focus on the input and opens the parent item. */
    const ToggleClickKeepsFocus = {
        ...INPUT_STATE,
        render: t.inputTemplate,
        async play() {
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            const vegetables = await screen.findByRole('treeitem', { name: 'Vegetables' });
            const row = vegetables.closest('.lumx-tree-list-item__row') as HTMLElement;
            await userEvent.click(getByClassName(row, 'lumx-tree-list-item__toggle'));
            await expect(input).toHaveFocus();
            await expect(vegetables).toHaveAttribute('aria-expanded', 'true');
            await expect(getTreeItemLabels()).toContain('Carrot');
            // Indent: one big spacing unit (16px) of left padding per level, on the row (full width background).
            const rowPadding = (label: string) =>
                getComputedStyle(
                    screen.getByRole('treeitem', { name: label }).closest('.lumx-tree-list-item__row') as HTMLElement,
                ).paddingLeft;
            await expect(rowPadding('Vegetables')).toBe('0px');
            await expect(rowPadding('Carrot')).toBe('16px');
            // The chevron is bigger than the default icon of a size `s` icon button (`--_lumx-icon-size`).
            const chevron = getByClassName(row, 'lumx-icon');
            await expect(getComputedStyle(chevron).width).toBe('20px');
            // The toggle does not make the row taller than a list item of size `tiny` (36px).
            await expect(row.getBoundingClientRect().height).toBe(36);
        },
    };

    /**
     * Non-selectable parent item: the expand toggle is the main action of the row. A click on the label
     * goes to the toggle overlay (browser hit testing), which opens or closes the item.
     */
    const ClickNonSelectableParentItemRow = {
        ...INPUT_STATE,
        render: t.inputTemplate,
        async play() {
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            const drinks = await screen.findByRole('treeitem', { name: 'Drinks' });
            const row = drinks.closest('.lumx-tree-list-item__row') as HTMLElement;
            const toggle = getByClassName(row, 'lumx-tree-list-item__toggle');
            // The element under the label is the toggle (its overlay), not the row button.
            const label = drinks.querySelector('[data-tree-label]') as HTMLElement;
            const { x, y, width, height } = label.getBoundingClientRect();
            const target = document.elementFromPoint(x + width / 2, y + height / 2) as HTMLElement;
            await expect(target).toBe(toggle);

            await userEvent.click(target);
            await expect(drinks).toHaveAttribute('aria-expanded', 'true');
            await expect(input).toHaveFocus();
            await userEvent.click(target);
            await expect(drinks).toHaveAttribute('aria-expanded', 'false');
            await expect(input).toHaveAttribute('aria-expanded', 'true');

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
     * popover hides (like an empty listbox).
     */
    const FilterNoMatchHidesPopover = {
        ...INPUT_STATE,
        args: { ...INPUT_STATE.args, withoutState: true },
        render: t.inputTemplate,
        async play() {
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree', { name: 'Food' });
            const popover = getByClassName(document.body, 'lumx-combobox-popover');
            const tree = getByClassName(popover, 'lumx-tree-list');
            await expect(getComputedStyle(popover).display).not.toBe('none');

            await userEvent.type(input, 'zzz');
            await waitFor(() => expect(getComputedStyle(popover).display).toBe('none'));
            await expect(getComputedStyle(tree).display).toBe('none');
            await expect(input).toHaveAttribute('aria-expanded', 'false');
        },
    };

    /** axe on the open tree: an open parent item, a selected sub-item, non-selectable items, a description. */
    const AccessibilityOpenTree = {
        ...INPUT_STATE,
        parameters: A11Y_ERROR,
        render: t.inputTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            const fruits = await screen.findByRole('treeitem', { name: 'Fruits' });
            await expect(fruits).toHaveAttribute('aria-expanded', 'true');
            await userEvent.keyboard('{ArrowDown}');
        },
    };

    /** axe on a tree with a loading group (skeletons inside a group). */
    const AccessibilityLoadingGroup = {
        args: { value: '', load: new Promise(() => {}) },
        decorators: [withValueOnChange()],
        parameters: A11Y_ERROR,
        render: t.lazyTemplate,
        async play() {
            await userEvent.click(screen.getByRole('combobox'));
            await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowRight}');
            const snacks = await screen.findByRole('treeitem', { name: 'Snacks' });
            const group = document.getElementById(snacks.getAttribute('aria-owns') as string);
            await waitFor(() => expect(group).toHaveAttribute('aria-busy', 'true'));
        },
    };

    /**
     * Standalone tree: a real click on a tree item focuses the tree and makes the tree item active, without
     * the focus ring (pointer). The next key press shows the focus ring.
     */
    const StandaloneClickHidesFocusRing = {
        args: { value: '' },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
        render: t.standaloneTemplate,
        async play() {
            const tree = screen.getByRole('tree', { name: 'Food' });
            const vegetables = screen.getByRole('treeitem', { name: 'Vegetables' });
            await userEvent.click(vegetables);
            await expect(tree).toHaveFocus();
            await expect(tree).toHaveAttribute('aria-activedescendant', vegetables.id);
            await expect(vegetables).not.toHaveAttribute('data-focus-visible-added');
            await userEvent.keyboard('{ArrowDown}');
            const drinks = screen.getByRole('treeitem', { name: 'Drinks' });
            await expect(tree).toHaveAttribute('aria-activedescendant', drinks.id);
            await expect(drinks).toHaveAttribute('data-focus-visible-added', 'true');
        },
    };

    /** axe on a standalone tree with an open parent item and a selected sub-item. */
    const AccessibilityStandaloneTree = {
        args: { value: 'lemon' },
        decorators: [withValueOnChange({ onChangeProp: 'onUpdate' })],
        parameters: A11Y_ERROR,
        render: t.standaloneTemplate,
        async play() {
            await userEvent.tab();
            await userEvent.tab();
            await expect(screen.getByRole('tree', { name: 'Food' })).toHaveFocus();
        },
    };

    return {
        meta,
        ToggleClickKeepsFocus,
        ClickNonSelectableParentItemRow,
        FilterNoMatchHidesPopover,
        AccessibilityOpenTree,
        AccessibilityLoadingGroup,
        StandaloneClickHidesFocusRing,
        AccessibilityStandaloneTree,
    };
}
