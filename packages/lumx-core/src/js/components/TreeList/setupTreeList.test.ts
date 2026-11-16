// @vitest-environment jsdom
import { screen, within } from '@testing-library/dom';
import { CLASSNAME as SKELETON_CLASSNAME } from '../Listbox/ListboxOptionSkeleton';
import { queryAllByClassName } from '../../../testing/queries';
import { setupTreeList } from './setupTreeList';
import {
    TREE_LABEL_ATTRIBUTE,
    TREE_MAIN_TOGGLE_VALUE,
    TREE_TOGGLE_ATTRIBUTE,
    getGroupOfRoot,
    getTreeItemOfRoot,
    getTreeListItemGroupId,
    getTreeListItemLabelId,
    writeTreeItemOpen,
} from './dom';
import type { TreeListItemController, TreeListItemState } from './types';

/**
 * The reference tree (SPEC 7.4), with the markup of the `TreeListItem` template (see the DOM contract in `dom.ts`).
 * Every parent item renders closed (the tree item controllers open them), `selected` lists the selected values.
 */
function renderTree({ multi = false, selected = [] as string[], sections = false } = {}) {
    const item = (label: string, opts: { value?: string; sub?: string; description?: string; lazy?: boolean }) => {
        const { value, sub, description, lazy } = opts;
        const id = label.toLowerCase();
        const groupId = getTreeListItemGroupId(id);
        const isParent = sub !== undefined || lazy;
        // Non-selectable parent item: the expand toggle is the main action (its overlay covers the row).
        const toggle = `<button ${TREE_TOGGLE_ATTRIBUTE}="${value === undefined ? TREE_MAIN_TOGGLE_VALUE : ''}" tabindex="-1" aria-hidden="true">`;
        return `
            <li role="none" class="lumx-tree-list-item">
                <div class="lumx-tree-list-item__row">
                    ${isParent ? `${toggle}</button>` : '<span></span>'}
                    <button id="${id}" role="treeitem" tabindex="-1" aria-labelledby="${getTreeListItemLabelId(id)}"
                        ${isParent ? `aria-owns="${groupId}" aria-expanded="false"` : ''}
                        ${value !== undefined ? `aria-selected="${selected.includes(value)}" data-value="${value}"` : ''}
                    ><span id="${getTreeListItemLabelId(id)}" ${TREE_LABEL_ATTRIBUTE}>${label}</span></button>
                    ${description ? `<p ${TREE_LABEL_ATTRIBUTE}>${description}</p>` : ''}
                </div>
                ${isParent ? `<ul role="group" id="${groupId}" hidden>${sub ?? ''}</ul>` : ''}
            </li>`;
    };
    /** A section (the markup of the `TreeListSection` template), only with the `sections` option. */
    const section = (name: string, content: string) =>
        sections
            ? `<li role="none" class="lumx-tree-list-section" data-testid="section-${name}"><ul role="none">${content}</ul></li>`
            : content;
    const html = `
        <input id="trigger" />
        <ul role="tree" aria-label="Food" ${multi ? 'aria-multiselectable="true"' : ''}>
            ${section(
                'food',
                `${item('Fruits', {
                    value: 'fruits',
                    sub: `${item('Citrus', {
                        sub: `${item('Lemon', { value: 'lemon' })}${item('Orange', { value: 'orange' })}`,
                    })}${item('Apple', { value: 'apple', description: 'Red or green' })}`,
                })}
            ${item('Vegetables', {
                value: 'vegetables',
                sub: `${item('Leek', { value: 'leek' })}${item('Carrot', { value: 'carrot' })}`,
            })}`,
            )}
            ${section(
                'other',
                `${item('Drinks', { sub: `${item('Lemonade', { value: 'lemonade' })}${item('Water', { value: 'water' })}` })}
                ${item('Snacks', { value: 'snacks', lazy: true })}`,
            )}
        </ul>`;
    document.body.innerHTML = html;
    /** A tree item element (the sub-items in a closed group are hidden). */
    const treeItem = (label: string) => screen.getByRole('treeitem', { name: label, hidden: true });
    /** The root of a tree item (holds the `hidden` attribute of the filter, and the group). */
    const li = (label: string) => treeItem(label).closest('li') as HTMLElement;
    return {
        trigger: screen.getByRole('textbox') as HTMLInputElement,
        tree: screen.getByRole('tree', { name: 'Food' }),
        li,
        treeItem,
        /** A section root (with the `sections` option). */
        sectionRoot: (name: string) => screen.getByTestId(`section-${name}`),
        /** The expand toggle of a parent item (out of the accessibility tree). */
        toggle: (label: string) => within(li(label)).getAllByRole('button', { hidden: true })[0],
    };
}

/** Render a tree item state as the `TreeListItem` template does. */
function render(root: HTMLElement, state: TreeListItemState) {
    if (getGroupOfRoot(root)) writeTreeItemOpen(root, state.isOpen);
    root.toggleAttribute('hidden', state.hidden);
}

/**
 * Set up the tree list (linked to a trigger input, or standalone) with a tree item controller on each tree
 * item (what the React and Vue tree item components do on mount). `open` lists the parent items opened by the
 * user before the test, `selected` the selected values.
 */
function setup(
    options: { open?: string[]; multi?: boolean; selected?: string[]; standalone?: boolean; sections?: boolean } = {},
) {
    const { open = [], standalone = false, ...renderOptions } = options;
    const dom = renderTree(renderOptions);
    const onSelect = vi.fn();
    const list = standalone
        ? setupTreeList({ onSelect })
        : setupTreeList({
              onSelect,
              wrapNavigation: true,
              focusOwner: { getFocusOwner: () => dom.trigger, getInputValue: () => dom.trigger.value },
          });
    // A standalone tree is a single tab stop.
    if (standalone) dom.tree.tabIndex = 0;
    list.mount(dom.tree);
    list.setOpen(true);

    /** The open and close actions of the user, in order (`onOpenChange` of each tree item). */
    const openChanges: Array<[string, boolean]> = [];
    const controllers: Record<string, TreeListItemController> = {};
    for (const root of queryAllByClassName(dom.tree, 'lumx-tree-list-item')) {
        const label = getTreeItemOfRoot(root)?.textContent?.trim() as string;
        const isParent = !!getGroupOfRoot(root);
        controllers[label] = list.registerTreeItem(root, {
            isParent: () => isParent,
            onOpenChange: (isOpen) => openChanges.push([label, isOpen]),
            onChange: (state) => render(root, state),
        });
        render(root, controllers[label].state);
    }
    for (const label of open) controllers[label].setOpen(true);
    openChanges.length = 0;

    const focusOwner = standalone ? dom.tree : dom.trigger;
    /** Press a key: on the trigger (linked), or on the focused tree (standalone). */
    const press = (key: string) => {
        if (!standalone) return list.handleKeydown(new KeyboardEvent('keydown', { key }));
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        (document.activeElement as HTMLElement).dispatchEvent(event);
        return event.defaultPrevented;
    };
    const lastCount = () => list.getSnapshot('optionsChange');
    return { ...dom, list, onSelect, controllers, openChanges, press, focusOwner, lastCount };
}

/** Run the next frame (the open state restore after a filter clear): the frames are faked. */
const nextFrame = () => vi.advanceTimersToNextFrame();

const { scrollIntoView } = Element.prototype;

beforeAll(() => {
    // Not implemented in jsdom (called in a frame after each activation).
    Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
});

beforeEach(() => {
    // Fake the frames only (the restore after a filter clear, the scroll of the active item).
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
});

afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
});

describe('setupTreeList', () => {
    describe('keyboard navigation', () => {
        it('moves down and up over the visible tree items only', () => {
            const { press, focusOwner, treeItem } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
            press('ArrowDown');
            // "Citrus" is visible (Fruits is open), its sub-items are not (Citrus is closed).
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Citrus').id);
            press('ArrowDown');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Apple').id);
            press('ArrowDown');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Vegetables').id);
            press('ArrowUp');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Apple').id);
        });

        it('moves to the first and last visible tree items with Home, End, PageDown and PageUp', () => {
            // Fruits and Citrus open (ancestors of the selected Lemon): 8 visible tree items.
            const { press, focusOwner, treeItem } = setup({ selected: ['lemon'] });
            press('ArrowDown');
            press('End');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Snacks').id);
            press('Home');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
            // 10 items down, clamped to the last visible tree item.
            press('PageDown');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Snacks').id);
            press('PageUp');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('opens a closed parent item on Right, the active item stays', () => {
            const { press, focusOwner, openChanges, treeItem } = setup();
            press('ArrowDown');
            expect(press('ArrowRight')).toBe(true);
            expect(openChanges).toEqual([['Fruits', true]]);
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('moves to the first visible sub-item on Right on an open parent item', () => {
            const { press, focusOwner, openChanges, treeItem } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowRight');
            expect(openChanges).toEqual([]);
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Citrus').id);
        });

        it('does nothing on Right on a leaf item', () => {
            const { press, focusOwner, openChanges, treeItem } = setup({ open: ['Drinks'] });
            press('ArrowUp');
            press('ArrowUp');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Water').id);
            expect(press('ArrowRight')).toBe(true);
            expect(openChanges).toEqual([]);
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Water').id);
        });

        it('closes an open parent item on Left', () => {
            const { press, openChanges, focusOwner, treeItem } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowLeft');
            expect(openChanges).toEqual([['Fruits', false]]);
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('moves to the parent item on Left on a sub-item', () => {
            const { press, focusOwner, treeItem } = setup({ open: ['Fruits'] });
            press('ArrowDown');
            press('ArrowDown');
            press('ArrowDown');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Apple').id);
            press('ArrowLeft');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('does nothing on Left on a closed root item', () => {
            const { press, focusOwner, openChanges, treeItem } = setup();
            press('ArrowDown');
            expect(press('ArrowLeft')).toBe(true);
            expect(openChanges).toEqual([]);
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('does not handle Right and Left without an active item', () => {
            const { press, openChanges } = setup();
            expect(press('ArrowRight')).toBe(false);
            expect(press('ArrowLeft')).toBe(false);
            expect(openChanges).toEqual([]);
        });

        it('skips the items inside a closed parent item for typeahead', () => {
            const { press, focusOwner, treeItem } = setup({ open: ['Drinks'] });
            // "Lemon" and "Leek" are inside closed parent items.
            press('L');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Lemonade').id);
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
    });

    describe('touch screen reader (TalkBack expand and collapse)', () => {
        it('opens or closes the tree item that gets an ArrowRight or ArrowLeft keydown', () => {
            const { treeItem, openChanges, onSelect, focusOwner } = setup({ open: ['Drinks'] });
            treeItem('Fruits').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            treeItem('Drinks').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
            // A leaf item: nothing.
            treeItem('Water').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(openChanges).toEqual([
                ['Fruits', true],
                ['Drinks', false],
            ]);
            expect(onSelect).not.toHaveBeenCalled();
            expect(focusOwner).not.toHaveAttribute('aria-activedescendant');
        });
    });

    describe('tree item registry (filter)', () => {
        it('shows the matching items, opens their ancestors and hides the others (auto filter)', () => {
            const { list, treeItem, li } = setup();
            list.setFilter('lemon');
            expect(li('Lemon')).not.toHaveAttribute('hidden');
            expect(li('Lemonade')).not.toHaveAttribute('hidden');
            // Ancestors: visible, opened by the filter (a match below).
            expect(li('Fruits')).not.toHaveAttribute('hidden');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            // Others: hidden.
            expect(li('Orange')).toHaveAttribute('hidden');
            expect(li('Apple')).toHaveAttribute('hidden');
            expect(li('Vegetables')).toHaveAttribute('hidden');
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false');
            expect(li('Water')).toHaveAttribute('hidden');
        });

        it('matches on the own label and description only, never on the sub-items text', () => {
            const { list, treeItem, li, lastCount } = setup();
            list.setFilter('green');
            expect(li('Apple')).not.toHaveAttribute('hidden');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
            list.setFilter('LEEK');
            // "Vegetables" contains the text "Leek" (sub-item) but does not match: one matching item.
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            expect(li('Leek')).not.toHaveAttribute('hidden');
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
        });

        it('shows the descendants of a matching parent item, and does not open it', () => {
            const { list, treeItem, li } = setup();
            list.setFilter('veg');
            expect(li('Vegetables')).not.toHaveAttribute('hidden');
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false');
            expect(li('Leek')).not.toHaveAttribute('hidden');
            expect(li('Carrot')).not.toHaveAttribute('hidden');
        });

        it('counts the matching items only during a filter, and hides the count without a filter', () => {
            const { list, lastCount } = setup();
            expect(lastCount()).toMatchObject({ optionsLength: 12, isCountHidden: true });
            list.setFilter('lemon');
            expect(lastCount()).toMatchObject({ optionsLength: 2, isCountHidden: false });
            list.setFilter('veg');
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
            list.setFilter('nothing');
            expect(lastCount()).toMatchObject({ optionsLength: 0 });
            expect(list.hasVisibleContent).toBe(false);
            list.setFilter('');
            expect(lastCount()).toMatchObject({ optionsLength: 12, isCountHidden: true });
        });

        it('notifies the hidden count flag even when the count does not change', () => {
            const { list, lastCount, controllers } = setup();
            // Keep 1 item: "Leek" (no filter: 1 item, count hidden).
            for (const [label, controller] of Object.entries(controllers)) {
                if (label !== 'Leek') controller.destroy();
            }
            expect(lastCount()).toMatchObject({ optionsLength: 1, isCountHidden: true });
            list.setFilter('leek');
            expect(lastCount()).toMatchObject({ optionsLength: 1, isCountHidden: false });
        });

        it('only opens the parent items with sub-items with the manual filter (nothing hidden)', () => {
            const { list, treeItem, li, lastCount } = setup();
            list.setFilter('lemon', 'manual');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(li('Fruits')).not.toHaveAttribute('hidden');
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            // Lazy parent item with no sub-items: not opened.
            expect(treeItem('Snacks')).toHaveAttribute('aria-expanded', 'false');
            expect(li('Snacks')).not.toHaveAttribute('hidden');
            expect(li('Water')).not.toHaveAttribute('hidden');
            // The consumer renders the result: every rendered item counts.
            expect(lastCount()).toMatchObject({ optionsLength: 12, isCountHidden: false });
        });

        it('stops updating a destroyed tree item', () => {
            const { list, controllers, li } = setup();
            controllers.Orange.destroy();
            list.setFilter('lemon');
            expect(li('Orange')).not.toHaveAttribute('hidden');
            expect(li('Apple')).toHaveAttribute('hidden');
        });

        it('computes the state of the tree items registered during a filter (lazy sub-items), in one update', async () => {
            const { list, li, treeItem, lastCount } = setup();
            list.setFilter('chip');
            expect(lastCount()).toMatchObject({ optionsLength: 0 });
            expect(li('Snacks')).toHaveAttribute('hidden');
            // The lazy sub-items of "Snacks" arrive.
            const group = getGroupOfRoot(li('Snacks')) as HTMLElement;
            group.innerHTML = `
                <li role="none"><div><button role="treeitem" id="chips"><span ${TREE_LABEL_ATTRIBUTE}>Chips</span></button></div></li>
                <li role="none"><div><button role="treeitem" id="nuts"><span ${TREE_LABEL_ATTRIBUTE}>Nuts</span></button></div></li>`;
            const onChange = vi.fn();
            const chips = list.registerTreeItem(li('Chips'), { isParent: () => false, onChange });
            const nuts = list.registerTreeItem(li('Nuts'), { isParent: () => false, onChange });
            // The registrations of one render share one update, before the next user event.
            await Promise.resolve();
            expect(chips.state).toEqual({ isOpen: false, hidden: false });
            expect(nuts.state).toEqual({ isOpen: false, hidden: true });
            expect(li('Snacks')).not.toHaveAttribute('hidden');
            expect(treeItem('Snacks')).toHaveAttribute('aria-expanded', 'true');
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
        });

        it('updates the filter state when a matching tree item is destroyed during a filter', async () => {
            const { list, controllers, li, lastCount } = setup();
            list.setFilter('lemon');
            expect(lastCount()).toMatchObject({ optionsLength: 2 });
            controllers.Lemonade.destroy();
            await Promise.resolve();
            expect(lastCount()).toMatchObject({ optionsLength: 1 });
            expect(li('Drinks')).toHaveAttribute('hidden');
        });
    });

    describe('section registry', () => {
        /** Register the two sections of the tree, rendered with the `hidden` attribute as the template does. */
        const registerSections = (
            list: ReturnType<typeof setup>['list'],
            sectionRoot: (name: string) => HTMLElement,
        ) => {
            const onChange = { food: vi.fn(), other: vi.fn() };
            const unregister = Object.fromEntries(
                (['food', 'other'] as const).map((name) => [
                    name,
                    list.registerSection(sectionRoot(name), (state) => {
                        onChange[name](state);
                        sectionRoot(name).toggleAttribute('hidden', state.hidden);
                    }),
                ]),
            );
            return { onChange, unregister };
        };

        it('notifies the initial state at once', () => {
            const { list, sectionRoot } = setup({ sections: true });
            const { onChange } = registerSections(list, sectionRoot);
            expect(onChange.food).toHaveBeenCalledExactlyOnceWith({ hidden: false });
            expect(onChange.other).toHaveBeenCalledExactlyOnceWith({ hidden: false });
        });

        it('hides a section when the auto filter hides all of its tree items, and shows it on clear', () => {
            const { list, sectionRoot } = setup({ sections: true });
            const { onChange } = registerSections(list, sectionRoot);
            list.setFilter('leek');
            expect(sectionRoot('food')).not.toHaveAttribute('hidden');
            expect(sectionRoot('other')).toHaveAttribute('hidden');
            // Typing more letters: no change, no notification.
            list.setFilter('lee');
            expect(onChange.other).toHaveBeenCalledTimes(2);
            list.setFilter('');
            expect(sectionRoot('other')).not.toHaveAttribute('hidden');
        });

        it('keeps the sections visible with the manual filter', () => {
            const { list, sectionRoot } = setup({ sections: true });
            registerSections(list, sectionRoot);
            list.setFilter('leek', 'manual');
            expect(sectionRoot('food')).not.toHaveAttribute('hidden');
            expect(sectionRoot('other')).not.toHaveAttribute('hidden');
        });

        it('keeps a section with no registered tree item visible', () => {
            const { list, sectionRoot, controllers } = setup({ sections: true });
            const { onChange } = registerSections(list, sectionRoot);
            for (const label of ['Drinks', 'Lemonade', 'Water', 'Snacks']) controllers[label].destroy();
            list.setFilter('leek');
            expect(sectionRoot('other')).not.toHaveAttribute('hidden');
            expect(onChange.other).toHaveBeenCalledTimes(1);
        });

        it('stops notifying an unregistered section', () => {
            const { list, sectionRoot } = setup({ sections: true });
            const { onChange, unregister } = registerSections(list, sectionRoot);
            unregister.other();
            list.setFilter('leek');
            expect(onChange.other).toHaveBeenCalledTimes(1);
        });

        it('moves over the tree items of all the sections, and keeps the parent items of the sections', () => {
            const { press, focusOwner, treeItem, sectionRoot, list } = setup({ sections: true, open: ['Vegetables'] });
            registerSections(list, sectionRoot);
            for (const label of ['Fruits', 'Vegetables', 'Leek', 'Carrot', 'Drinks', 'Snacks']) {
                press('ArrowDown');
                expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem(label).id);
            }
            // Left on a root tree item in a section: no parent item (the section is not a group).
            press('ArrowUp');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Drinks').id);
            press('ArrowLeft');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Drinks').id);
            // Left on a sub-item: back to its parent item.
            press('ArrowUp');
            press('ArrowLeft');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Vegetables').id);
        });
    });

    describe('tree item controller (open state)', () => {
        it('opens the ancestors of a selected sub-item on setup', () => {
            const { treeItem, li } = setup({ selected: ['lemon'] });
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'false');
            expect(getGroupOfRoot(li('Citrus'))).not.toHaveAttribute('hidden');
        });

        it('moves the active item out of a closing group to the parent item', () => {
            const { press, focusOwner, controllers, treeItem } = setup();
            press('ArrowDown');
            press('ArrowRight');
            press('ArrowRight');
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Citrus').id);
            controllers.Fruits.toggle();
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Fruits').id);
        });

        it('does nothing on a leaf item', () => {
            const { controllers, treeItem, openChanges } = setup();
            controllers.Leek.setOpen(true);
            expect(controllers.Leek.state.isOpen).toBe(false);
            expect(treeItem('Leek')).not.toHaveAttribute('aria-expanded');
            expect(openChanges).toEqual([]);
        });

        it('opens the parent items with a match below during a filter, then restores the user state', () => {
            const { list, controllers, treeItem, li } = setup();
            controllers.Vegetables.setOpen(true);
            list.setFilter('lemon');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Drinks')).toHaveAttribute('aria-expanded', 'true');
            expect(li('Vegetables')).toHaveAttribute('hidden');
            expect(li('Apple')).toHaveAttribute('hidden');

            list.setFilter('');
            // The open state does not change until the next frame (the selection renders meanwhile).
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(li('Vegetables')).not.toHaveAttribute('hidden');
            nextFrame();
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(treeItem('Citrus')).toHaveAttribute('aria-expanded', 'false');
            expect(treeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
        });

        it('keeps a user action during the filter until the next change of the filter text', () => {
            const { list, controllers, treeItem, openChanges } = setup();
            list.setFilter('lemon');
            controllers.Fruits.toggle();
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(openChanges).toEqual([['Fruits', false]]);
            list.setFilter('lemo');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
        });

        it('does not keep a user action after a clear, even for the same filter text', () => {
            const { list, controllers, treeItem } = setup();
            list.setFilter('lemon');
            controllers.Fruits.toggle();
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            list.setFilter('');
            nextFrame();
            list.setFilter('lemon');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
        });

        it('keeps the ancestors of an item selected during the filter open after the clear', () => {
            const { list, treeItem } = setup();
            list.setFilter('lemon');
            // A selection clears the filter, then the framework renders the new `aria-selected`.
            list.setFilter('');
            treeItem('Lemon').setAttribute('aria-selected', 'true');
            nextFrame();
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Citrus')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Drinks')).toHaveAttribute('aria-expanded', 'false');
        });

        it('applies a user action during the restore at once (it ends the restore)', () => {
            const { list, controllers, treeItem, openChanges } = setup();
            list.setFilter('lemon');
            list.setFilter('');
            // Before the restore frame: the user opens "Vegetables" (closed during the "lemon" filter).
            controllers.Vegetables.setOpen(true);
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            expect(openChanges).toEqual([['Vegetables', true]]);
            nextFrame();
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            // The other tree items are restored on the frame.
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
        });

        it('cancels the restore when a new filter comes before the next frame', () => {
            const { list, treeItem } = setup();
            list.setFilter('lemon');
            list.setFilter('');
            list.setFilter('leek');
            nextFrame();
            expect(treeItem('Vegetables')).toHaveAttribute('aria-expanded', 'true');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
        });

        it('marks a group busy while it holds skeletons and no sub-item', async () => {
            const { li } = setup();
            const group = getGroupOfRoot(li('Snacks')) as HTMLElement;
            const skeleton = document.createElement('li');
            skeleton.className = SKELETON_CLASSNAME;
            group.append(skeleton);
            // The mutation observer callback runs in a microtask.
            await Promise.resolve();
            expect(group).toHaveAttribute('aria-busy', 'true');
            const subItem = document.createElement('li');
            subItem.innerHTML = '<button role="treeitem">Chips</button>';
            group.append(subItem);
            await Promise.resolve();
            expect(group).not.toHaveAttribute('aria-busy');
        });

        it('stops listening after destroy', () => {
            const { press, controllers, treeItem, openChanges } = setup();
            controllers.Fruits.destroy();
            press('ArrowDown');
            press('ArrowRight');
            expect(treeItem('Fruits')).toHaveAttribute('aria-expanded', 'false');
            expect(openChanges).toEqual([]);
        });
    });

    describe('standalone (the tree owns focus)', () => {
        it('makes the tree item of a pressed main expand toggle the active item, and focuses the tree', () => {
            const { list, onSelect, toggle, focusOwner, treeItem } = setup({ standalone: true });
            // A non-selectable parent item: the click lands on its main expand toggle (the row action lets the
            // pointer through to the toggle overlay). Its tree item becomes active, not selected.
            const drinksToggle = toggle('Drinks');
            const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            drinksToggle.dispatchEvent(mousedown);
            drinksToggle.click();
            expect(mousedown.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(list.element);
            expect(focusOwner).toHaveAttribute('aria-activedescendant', treeItem('Drinks').id);
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('focuses the tree on a press on the expand toggle of a selectable parent item, without an active item', () => {
            const { list, toggle, focusOwner, onSelect } = setup({ standalone: true });
            // A selectable parent item: its expand toggle is not the main action of the row.
            const vegetablesToggle = toggle('Vegetables');
            const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            vegetablesToggle.dispatchEvent(mousedown);
            vegetablesToggle.click();
            expect(mousedown.defaultPrevented).toBe(true);
            expect(document.activeElement).toBe(list.element);
            expect(focusOwner).not.toHaveAttribute('aria-activedescendant');
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('has no TalkBack listener (the keys go to the active item)', () => {
            const { treeItem, openChanges } = setup({ standalone: true });
            // No active item: the key is not handled.
            treeItem('Fruits').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            expect(openChanges).toEqual([]);
        });

        it('hides the item count (no filter)', () => {
            const { lastCount } = setup({ standalone: true });
            expect(lastCount()).toMatchObject({ optionsLength: 12, isCountHidden: true });
        });
    });
});
