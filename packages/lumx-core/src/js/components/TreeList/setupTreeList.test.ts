// @vitest-environment jsdom
import { setupTreeList } from './setupTreeList';
import { TREE_ITEM_TOGGLE_EVENT } from './navigation';
import type { TreeItemFilterState, TreeListHandle } from './types';

/**
 * The reference tree (SPEC 7.4), as rendered by the tree item components.
 * `open` lists the parent items rendered open, `selected` the selected values.
 */
function renderTree({ open = [] as string[], multi = false, selected = [] as string[] } = {}) {
    const item = (label: string, opts: { value?: string; sub?: string; description?: string; lazy?: boolean }) => {
        const { value, sub, description, lazy } = opts;
        const id = label.toLowerCase();
        const isParent = sub !== undefined || lazy;
        const isOpen = open.includes(label);
        // Non-selectable parent item: the expand toggle is the main action (its overlay covers the row).
        const toggle = `<button data-tree-toggle="${value === undefined ? 'main' : ''}" tabindex="-1" aria-hidden="true">`;
        return `
            <li role="none" class="lumx-tree-list-item" id="li-${id}">
                <div class="lumx-tree-list-item__row">
                    ${isParent ? `${toggle}</button>` : '<span></span>'}
                    <button id="${id}" role="treeitem" tabindex="-1"
                        ${isParent ? `aria-owns="${id}-group" aria-expanded="${isOpen}"` : ''}
                        ${value !== undefined ? `aria-selected="${selected.includes(value)}" data-value="${value}"` : ''}
                    ><span data-tree-label>${label}</span></button>
                    ${description ? `<p data-tree-label>${description}</p>` : ''}
                </div>
                ${isParent ? `<ul role="group" id="${id}-group" ${isOpen ? '' : 'hidden'}>${sub ?? ''}</ul>` : ''}
            </li>`;
    };
    const html = `
        <input id="trigger" />
        <ul role="tree" aria-label="Food" ${multi ? 'aria-multiselectable="true"' : ''}>
            ${item('Fruits', {
                value: 'fruits',
                sub: `${item('Citrus', {
                    sub: `${item('Lemon', { value: 'lemon' })}${item('Orange', { value: 'orange' })}`,
                })}${item('Apple', { value: 'apple', description: 'Red or green' })}`,
            })}
            ${item('Vegetables', {
                value: 'vegetables',
                sub: `${item('Leek', { value: 'leek' })}${item('Carrot', { value: 'carrot' })}`,
            })}
            ${item('Drinks', { sub: `${item('Lemonade', { value: 'lemonade' })}${item('Water', { value: 'water' })}` })}
            ${item('Snacks', { value: 'snacks', lazy: true })}
            ${item('Create', {})}
        </ul>`;
    document.body.innerHTML = html;
    return {
        trigger: document.getElementById('trigger') as HTMLInputElement,
        tree: document.querySelector('[role="tree"]') as HTMLElement,
        li: (label: string) => document.getElementById(`li-${label.toLowerCase()}`) as HTMLElement,
        treeItem: (label: string) => document.getElementById(label.toLowerCase()) as HTMLElement,
    };
}

/** Open or close a rendered parent item (what the tree item component does on a toggle request). */
function setRenderedOpen(item: HTMLElement, isOpen: boolean) {
    item.setAttribute('aria-expanded', String(isOpen));
    document.getElementById(item.getAttribute('aria-owns') as string)?.toggleAttribute('hidden', !isOpen);
}

function setup(options: { open?: string[]; multi?: boolean } = {}) {
    const dom = renderTree(options);
    const onSelect = vi.fn();
    const list: TreeListHandle = setupTreeList({
        onSelect,
        wrapNavigation: true,
        focusOwner: { getFocusOwner: () => dom.trigger, getInputValue: () => dom.trigger.value },
    });
    list.mount(dom.tree);
    list.setOpen(true);
    /** Open/close requests received by each tree item. */
    const toggleRequests: Array<[string, boolean]> = [];
    dom.tree.addEventListener(TREE_ITEM_TOGGLE_EVENT, (event) => {
        toggleRequests.push([(event.target as HTMLElement).textContent?.trim() ?? '', (event as CustomEvent).detail]);
    });
    const press = (key: string) => list.handleKeydown(new KeyboardEvent('keydown', { key }));
    const activeLabel = () => {
        const id = dom.trigger.getAttribute('aria-activedescendant');
        return id ? document.getElementById(id)?.textContent?.trim() : undefined;
    };
    return { ...dom, list, onSelect, toggleRequests, press, activeLabel };
}

const { scrollIntoView } = Element.prototype;

beforeAll(() => {
    // Not implemented in jsdom (called on each activation).
    Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
});

afterEach(async () => {
    // Let the pending scroll of the last activation run while the stub is in place.
    await new Promise((resolve) => {
        requestAnimationFrame(resolve);
    });
    document.body.innerHTML = '';
});

describe('setupTreeList', () => {
    describe('keyboard navigation', () => {
        it('reports the tree type', () => {
            const { list } = setup();
            expect(list.type).toBe('tree');
        });

        it('moves down and up over the visible tree items only', () => {
            const { press, activeLabel } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            expect(activeLabel()).toBe('Fruits');
            press('ArrowDown');
            // "Citrus" is visible (Fruits is open), its sub-items are not (Citrus is closed).
            expect(activeLabel()).toBe('Citrus');
            press('ArrowDown');
            expect(activeLabel()).toBe('Apple');
            press('ArrowDown');
            expect(activeLabel()).toBe('Vegetables');
            press('ArrowUp');
            expect(activeLabel()).toBe('Apple');
        });

        it('opens a closed parent item on Right, the active item stays', () => {
            const { press, activeLabel, toggleRequests } = setup();
            press('ArrowDown');
            expect(press('ArrowRight')).toBe(true);
            expect(toggleRequests).toEqual([['Fruits', true]]);
            expect(activeLabel()).toBe('Fruits');
        });

        it('moves to the first visible sub-item on Right on an open parent item', () => {
            const { press, activeLabel, toggleRequests } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowRight');
            expect(toggleRequests).toEqual([]);
            expect(activeLabel()).toBe('Citrus');
        });

        it('does nothing on Right on a leaf item', () => {
            const { press, activeLabel, toggleRequests } = setup();
            press('ArrowUp');
            expect(activeLabel()).toBe('Create');
            expect(press('ArrowRight')).toBe(true);
            expect(toggleRequests).toEqual([]);
            expect(activeLabel()).toBe('Create');
        });

        it('closes an open parent item on Left', () => {
            const { press, toggleRequests, activeLabel } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowLeft');
            expect(toggleRequests).toEqual([['Fruits', false]]);
            expect(activeLabel()).toBe('Fruits');
        });

        it('moves to the parent item on Left on a sub-item', () => {
            const { press, activeLabel } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowDown');
            press('ArrowDown');
            expect(activeLabel()).toBe('Apple');
            press('ArrowLeft');
            expect(activeLabel()).toBe('Fruits');
        });

        it('does nothing on Left on a closed root item', () => {
            const { press, activeLabel, toggleRequests } = setup();
            press('ArrowDown');
            expect(press('ArrowLeft')).toBe(true);
            expect(toggleRequests).toEqual([]);
            expect(activeLabel()).toBe('Fruits');
        });

        it('does not handle Right and Left without an active item', () => {
            const { press, toggleRequests } = setup();
            expect(press('ArrowRight')).toBe(false);
            expect(press('ArrowLeft')).toBe(false);
            expect(toggleRequests).toEqual([]);
        });

        it('moves to the first visible sub-item once the rendered group opens', () => {
            const { press, activeLabel, treeItem } = setup();
            press('ArrowDown');
            press('ArrowRight');
            setRenderedOpen(treeItem('Fruits'), true);
            press('ArrowRight');
            expect(activeLabel()).toBe('Citrus');
        });

        it('skips the items inside a closed parent item for typeahead', () => {
            const { press, activeLabel } = setup();
            // "Citrus" and "Carrot" are inside closed parent items.
            press('C');
            expect(activeLabel()).toBe('Create');
        });
    });

    describe('selection', () => {
        it('selects a selectable tree item on Enter', () => {
            const { press, onSelect } = setup();
            press('ArrowDown');
            press('Enter');
            expect(onSelect).toHaveBeenCalledWith({ value: 'fruits' }, expect.anything());
        });

        it('does not select a non-selectable tree item on Enter', () => {
            const { press, onSelect, treeItem } = setup();
            const onClick = vi.fn();
            treeItem('Drinks').addEventListener('click', onClick);
            press('ArrowDown');
            press('ArrowDown');
            press('ArrowDown');
            press('Enter');
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('prevents the mousedown on the expand toggle (focus stays on the trigger)', () => {
            const { tree } = setup();
            const toggle = tree.querySelector('[data-tree-toggle]') as HTMLElement;
            const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            toggle.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });
    });

    describe('touch screen reader (TalkBack expand and collapse)', () => {
        it('opens or closes the tree item that gets an ArrowRight or ArrowLeft keydown', () => {
            const { treeItem, toggleRequests, onSelect, activeLabel } = setup({ open: ['Drinks'] });
            treeItem('Fruits').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            treeItem('Drinks').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            // A leaf item: nothing.
            treeItem('Create').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(toggleRequests).toEqual([
                ['Fruits', true],
                ['Drinks', false],
            ]);
            expect(onSelect).not.toHaveBeenCalled();
            expect(activeLabel()).toBeUndefined();
        });
    });

    describe('tree item registry (filter)', () => {
        const LABELS = ['Fruits', 'Citrus', 'Lemon', 'Orange', 'Apple', 'Vegetables', 'Leek', 'Carrot'];
        const MORE = ['Drinks', 'Lemonade', 'Water', 'Snacks', 'Create'];

        /** Register every tree item and keep its last filter state. */
        function setupRegistry(options: { open?: string[] } = {}) {
            const ctx = setup(options);
            const states: Record<string, TreeItemFilterState> = {};
            const optionsChange = vi.fn();
            ctx.list.subscribe('optionsChange', optionsChange);
            const unregister = [...LABELS, ...MORE].map((label) =>
                ctx.list.registerTreeItem(ctx.li(label), (state) => {
                    states[label] = state;
                }),
            );
            const lastCount = () => optionsChange.mock.lastCall?.[0];
            return { ...ctx, states, lastCount, unregister };
        }

        it('notifies each tree item on registration (no filter: nothing hidden)', () => {
            const { states } = setupRegistry();
            expect(states.Lemon).toEqual({ filter: '', hidden: false, matching: false, hasMatchBelow: false });
            expect(states.Fruits).toEqual({ filter: '', hidden: false, matching: false, hasMatchBelow: false });
        });

        it('computes the matching items, their ancestors and the hidden items (auto filter)', () => {
            const { list, states } = setupRegistry();
            list.setFilter('lemon');
            expect(states.Lemon).toMatchObject({ filter: 'lemon', matching: true, hidden: false });
            expect(states.Lemonade).toMatchObject({ matching: true, hidden: false });
            // Ancestors: visible, opened by the filter (a match below).
            expect(states.Fruits).toMatchObject({ matching: false, hidden: false, hasMatchBelow: true });
            expect(states.Citrus).toMatchObject({ matching: false, hidden: false, hasMatchBelow: true });
            expect(states.Drinks).toMatchObject({ matching: false, hidden: false, hasMatchBelow: true });
            // Others: hidden.
            expect(states.Orange).toMatchObject({ hidden: true });
            expect(states.Apple).toMatchObject({ hidden: true });
            expect(states.Vegetables).toMatchObject({ hidden: true, hasMatchBelow: false });
            expect(states.Water).toMatchObject({ hidden: true });
            expect(states.Create).toMatchObject({ hidden: true });
        });

        it('matches on the own label and description only, never on the sub-items text', () => {
            const { list, states } = setupRegistry();
            list.setFilter('green');
            expect(states.Apple).toMatchObject({ matching: true, hidden: false });
            expect(states.Fruits).toMatchObject({ matching: false, hasMatchBelow: true });
            list.setFilter('LEEK');
            // "Vegetables" contains the text "Leek" (sub-item) but does not match.
            expect(states.Vegetables).toMatchObject({ matching: false, hasMatchBelow: true });
            expect(states.Leek).toMatchObject({ matching: true });
        });

        it('shows the descendants of a matching parent item, and does not open it', () => {
            const { list, states } = setupRegistry();
            list.setFilter('veg');
            expect(states.Vegetables).toMatchObject({ matching: true, hidden: false, hasMatchBelow: false });
            expect(states.Leek).toMatchObject({ matching: false, hidden: false });
            expect(states.Carrot).toMatchObject({ matching: false, hidden: false });
        });

        it('counts the matching items only during a filter, and hides the count without a filter', () => {
            const { list, lastCount } = setupRegistry();
            expect(lastCount()).toMatchObject({ optionsLength: 13, isCountHidden: true });
            list.setFilter('lemon');
            expect(lastCount()).toMatchObject({ optionsLength: 2, isCountHidden: false });
            list.setFilter('veg');
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
            list.setFilter('nothing');
            expect(lastCount()).toMatchObject({ optionsLength: 0 });
            expect(list.hasVisibleContent).toBe(false);
            list.setFilter('');
            expect(lastCount()).toMatchObject({ optionsLength: 13, isCountHidden: true });
        });

        it('notifies the hidden count flag even when the count does not change', () => {
            const { list, lastCount, unregister } = setupRegistry();
            // Keep 1 item: "Create" (no filter: 1 item, count hidden).
            unregister.slice(0, -1).forEach((cleanup) => cleanup());
            expect(lastCount()).toMatchObject({ optionsLength: 1, isCountHidden: true });
            list.setFilter('create');
            expect(lastCount()).toMatchObject({ optionsLength: 1, isCountHidden: false });
        });

        it('only opens the parent items with sub-items with the manual filter (nothing hidden)', () => {
            const { list, states, lastCount } = setupRegistry();
            list.setFilter('lemon', 'manual');
            expect(states.Fruits).toMatchObject({ filter: 'lemon', hidden: false, hasMatchBelow: true });
            expect(states.Vegetables).toMatchObject({ hidden: false, hasMatchBelow: true });
            // Lazy parent item with no sub-items: not opened.
            expect(states.Snacks).toMatchObject({ hidden: false, hasMatchBelow: false });
            expect(states.Water).toMatchObject({ hidden: false, matching: false });
            // The consumer renders the result: every rendered item counts.
            expect(lastCount()).toMatchObject({ optionsLength: 13, isCountHidden: false });
        });

        it('stops notifying an unregistered tree item', () => {
            const { list, states, unregister } = setupRegistry();
            unregister[2]();
            list.setFilter('lemon');
            expect(states.Lemon).toMatchObject({ filter: '' });
        });
    });

    describe('skeletons in a group', () => {
        it('do not make the tree busy, but start the loading announcement', () => {
            vi.useFakeTimers();
            const { list } = setup();
            const loadingChange = vi.fn();
            const loadingAnnouncement = vi.fn();
            list.subscribe('loadingChange', loadingChange);
            list.subscribe('loadingAnnouncement', loadingAnnouncement);
            const unregister = list.registerSkeleton({ isNested: true });
            expect(list.isLoading).toBe(false);
            expect(loadingChange).not.toHaveBeenCalled();
            vi.advanceTimersByTime(600);
            expect(loadingAnnouncement).toHaveBeenLastCalledWith(true);
            unregister();
            expect(loadingAnnouncement).toHaveBeenLastCalledWith(false);
            vi.useRealTimers();
        });
    });

    describe('standalone (the tree owns focus)', () => {
        /** A standalone tree: no focus owner link, the tree is a single tab stop. */
        function setupStandalone(options: { open?: string[]; selected?: string[] } = {}) {
            const dom = renderTree(options);
            dom.tree.tabIndex = 0;
            const onSelect = vi.fn();
            const tree = setupTreeList({ onSelect });
            tree.mount(dom.tree);
            const toggleRequests: Array<[string, boolean]> = [];
            dom.tree.addEventListener(TREE_ITEM_TOGGLE_EVENT, (event) => {
                const target = event.target as HTMLElement;
                toggleRequests.push([target.textContent?.trim() ?? '', (event as CustomEvent).detail]);
            });
            /** Press a key on the focused element (the tree). */
            const keydown = (key: string) => {
                const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
                (document.activeElement as HTMLElement).dispatchEvent(event);
                return event;
            };
            const activeLabel = () => {
                const id = dom.tree.getAttribute('aria-activedescendant');
                return id ? document.getElementById(id)?.textContent?.trim() : undefined;
            };
            return { ...dom, tree, onSelect, toggleRequests, keydown, activeLabel };
        }

        it('is always open and owns focus', () => {
            const { tree } = setupStandalone();
            expect(tree.isStandalone).toBe(true);
            expect(tree.isOpen).toBe(true);
            expect(tree.type).toBe('tree');
        });

        it('shows the first tree item on focus', () => {
            const { tree, activeLabel } = setupStandalone();
            tree.element?.focus();
            expect(activeLabel()).toBe('Fruits');
        });

        it('shows the selected tree item on focus', () => {
            const { tree, activeLabel } = setupStandalone({ open: ['Vegetables'], selected: ['carrot'] });
            tree.element?.focus();
            expect(activeLabel()).toBe('Carrot');
        });

        it('handles the navigation keys on the tree', () => {
            const { tree, keydown, activeLabel, toggleRequests, treeItem } = setupStandalone();
            tree.element?.focus();
            expect(keydown('ArrowDown').defaultPrevented).toBe(true);
            expect(activeLabel()).toBe('Vegetables');
            keydown('ArrowRight');
            expect(toggleRequests).toEqual([['Vegetables', true]]);
            setRenderedOpen(treeItem('Vegetables'), true);
            keydown('ArrowRight');
            expect(activeLabel()).toBe('Leek');
            keydown('ArrowLeft');
            expect(activeLabel()).toBe('Vegetables');
            keydown('End');
            expect(activeLabel()).toBe('Create');
            keydown('Home');
            expect(activeLabel()).toBe('Fruits');
            // Typeahead over the visible tree items ("Citrus" is inside a closed parent item).
            keydown('c');
            expect(activeLabel()).toBe('Carrot');
        });

        it('selects the active selectable tree item with Enter and Space', () => {
            const { tree, keydown, onSelect } = setupStandalone();
            tree.element?.focus();
            keydown('Enter');
            expect(onSelect).toHaveBeenLastCalledWith({ value: 'fruits' }, expect.anything());
            keydown('ArrowDown');
            keydown(' ');
            expect(onSelect).toHaveBeenLastCalledWith({ value: 'vegetables' }, expect.anything());
            expect(onSelect).toHaveBeenCalledTimes(2);
        });

        it('only clicks a non-selectable tree item with Enter (no selection)', () => {
            const { tree, keydown, onSelect, treeItem, activeLabel } = setupStandalone();
            const onClick = vi.fn();
            treeItem('Drinks').addEventListener('click', onClick);
            tree.element?.focus();
            keydown('ArrowDown');
            keydown('ArrowDown');
            expect(activeLabel()).toBe('Drinks');
            keydown('Enter');
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('makes a clicked tree item the active item and focuses the tree', () => {
            const { tree, onSelect, treeItem, li, activeLabel } = setupStandalone();
            const press = (element: HTMLElement) => {
                const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
                element.dispatchEvent(mousedown);
                element.click();
                return mousedown;
            };
            // A non-selectable parent item: the click lands on its main expand toggle (the row button lets the
            // pointer through to the toggle overlay). Its tree item becomes active, not selected.
            const drinksToggle = li('Drinks').querySelector('[data-tree-toggle]') as HTMLElement;
            expect(press(drinksToggle).defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(tree.element);
            expect(activeLabel()).toBe('Drinks');
            expect(onSelect).not.toHaveBeenCalled();
            // A selectable tree item: active and selected.
            press(treeItem('Snacks'));
            expect(activeLabel()).toBe('Snacks');
            expect(onSelect).toHaveBeenCalledWith({ value: 'snacks' }, treeItem('Snacks'));
        });

        it('does not move the active item on a click on the expand toggle of a selectable parent item', () => {
            const { tree, li, activeLabel } = setupStandalone();
            tree.element?.focus();
            expect(activeLabel()).toBe('Fruits');
            const vegetablesToggle = li('Vegetables').querySelector('[data-tree-toggle]') as HTMLElement;
            vegetablesToggle.click();
            expect(activeLabel()).toBe('Fruits');
        });

        it('does not focus the tree on a press on a disabled tree item', () => {
            const { tree, treeItem, activeLabel } = setupStandalone();
            treeItem('Snacks').setAttribute('aria-disabled', 'true');
            const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            treeItem('Snacks').dispatchEvent(mousedown);
            treeItem('Snacks').click();
            expect(mousedown.defaultPrevented).toBe(true);
            expect(document.activeElement).not.toBe(tree.element);
            expect(activeLabel()).toBeUndefined();
        });

        it('focuses the tree on a press on an expand toggle, without an active item', () => {
            const { tree, activeLabel } = setupStandalone();
            const toggle = tree.element?.querySelector('[data-tree-toggle]') as HTMLElement;
            const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            toggle.dispatchEvent(mousedown);
            expect(mousedown.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(tree.element);
            expect(activeLabel()).toBeUndefined();
        });

        it('clears the active item on focus out', () => {
            const { tree, trigger, activeLabel } = setupStandalone();
            tree.element?.focus();
            expect(activeLabel()).toBe('Fruits');
            trigger.focus();
            expect(activeLabel()).toBeUndefined();
        });

        it('has no TalkBack listener (the keys go to the active item)', () => {
            const { treeItem, toggleRequests } = setupStandalone();
            // No active item: the key is not handled.
            treeItem('Fruits').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(toggleRequests).toEqual([]);
        });

        it('hides the item count (no filter)', () => {
            const { tree, li } = setupStandalone();
            const optionsChange = vi.fn();
            tree.subscribe('optionsChange', optionsChange);
            tree.registerTreeItem(li('Fruits'), () => {});
            expect(optionsChange).toHaveBeenLastCalledWith(expect.objectContaining({ isCountHidden: true }));
        });
    });
});
