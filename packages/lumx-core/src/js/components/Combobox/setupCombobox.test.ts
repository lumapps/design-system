// @vitest-environment jsdom
import { within } from '@testing-library/dom';
import { setupListbox } from '../Listbox/setupListbox';
import type { CompositeHandle } from '../Composite/types';
import { setupCombobox } from './setupCombobox';
import { COMBOBOX_POPOVER_CLASSNAME } from './constants';

/** Render a trigger input and a list of options inside a combobox popover. */
function render(labels: string[], role = 'listbox') {
    const input = document.createElement('input');
    const popover = document.createElement('div');
    popover.className = COMBOBOX_POPOVER_CLASSNAME;
    popover.innerHTML = `<ul role="${role}">${labels
        .map((label) => `<li id="opt-${label}" role="option" aria-selected="false">${label}</li>`)
        .join('')}</ul>`;
    document.body.append(input, popover);
    return { input, listElement: popover.firstElementChild as HTMLElement };
}

/** The options of a list element (also while the list is hidden: no visible content yet). */
const getOptions = (listElement: HTMLElement) => within(listElement).queryAllByRole('option', { hidden: true });

describe(setupCombobox, () => {
    const { scrollIntoView } = Element.prototype;
    beforeEach(() => {
        // Not implemented in jsdom (called in a frame after an item becomes active).
        Element.prototype.scrollIntoView = vi.fn();
    });
    afterEach(async () => {
        // Let the pending frames run while the stub is still in place.
        await new Promise((resolve) => {
            requestAnimationFrame(resolve);
        });
        Element.prototype.scrollIntoView = scrollIntoView;
        document.body.innerHTML = '';
    });

    it('should own the open state before any list registers', () => {
        const combobox = setupCombobox({});
        const { input } = render([]);
        combobox.registerTrigger(input);
        const changes: boolean[] = [];
        combobox.subscribe('open', (isOpen) => changes.push(isOpen));

        expect(combobox.list).toBeNull();
        combobox.setIsOpen(true);
        expect(combobox.isOpen).toBe(true);
        expect(combobox.getSnapshot('open')).toBe(true);
        expect(changes).toEqual([true]);
        // Nothing to show without a list.
        expect(input).toHaveAttribute('aria-expanded', 'false');

        // Replayed on subscribe while open.
        const replayed: boolean[] = [];
        combobox.subscribe('open', (isOpen) => replayed.push(isOpen));
        expect(replayed).toEqual([true]);
        combobox.destroy();
    });

    it('should forward the open state to the list on attach', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render(['Apple', 'Banana']);
        combobox.registerTrigger(input);

        // Open before the list attaches.
        combobox.setIsOpen(true);

        const { list, detach } = combobox.attachList(setupListbox);
        expect(combobox.list).toBe(list);
        expect(combobox.getSnapshot('composite')).toBe(list);
        expect(list.isOpen).toBe(true);
        expect(list.getSnapshot('open')).toBe(true);

        // The trigger is the focus owner of the list.
        list.mount(listElement);
        getOptions(listElement).forEach((option) => list.registerOption(option, () => undefined));
        expect(input).toHaveAttribute('aria-expanded', 'true');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(input).toHaveAttribute('aria-activedescendant', 'opt-Apple');
        expect(listElement).not.toHaveAttribute('aria-activedescendant');

        // Closing is forwarded to the list.
        combobox.setIsOpen(false);
        expect(list.isOpen).toBe(false);
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
        detach();
    });

    it('should unregister, then destroy a detached list', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render(['Apple']);
        const [option] = getOptions(listElement);
        combobox.registerTrigger(input);

        const { list, detach } = combobox.attachList(setupListbox);
        list.mount(listElement);
        combobox.setIsOpen(true);
        expect(list.isOpen).toBe(true);
        const open = vi.fn();
        const optionsChange = vi.fn();
        list.subscribe('open', open);
        list.subscribe('optionsChange', optionsChange);

        detach();
        expect(combobox.list).toBeNull();
        // Destroyed: its subscribers are removed, and the trigger keyboard no longer moves its active item.
        list.registerOption(option, () => undefined);
        expect(optionsChange).not.toHaveBeenCalled();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(input).toHaveAttribute('aria-activedescendant', '');

        // The open state is no longer forwarded.
        combobox.setIsOpen(false);
        combobox.setIsOpen(true);
        expect(open).not.toHaveBeenCalled();

        // `aria-expanded` no longer follows the list options (an option registered on the detached list).
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
    });

    it('should collapse the trigger when the list detaches while open', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render(['Apple', 'Banana', 'Cherry']);
        combobox.registerTrigger(input);
        combobox.setIsOpen(true);

        const { list, detach } = combobox.attachList(setupListbox);
        list.mount(listElement);
        const unregisterOptions = getOptions(listElement).map((option) => list.registerOption(option, () => undefined));
        expect(input).toHaveAttribute('aria-expanded', 'true');

        // The list detaches before its options (ex: React runs the parent effect cleanup first).
        detach();
        unregisterOptions.forEach((unregisterOption) => unregisterOption());
        expect(combobox.isOpen).toBe(true);
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
    });

    it('should replace the list on a new attach', () => {
        const combobox = setupCombobox({});
        const { input } = render([]);
        combobox.registerTrigger(input);
        const lists: Array<CompositeHandle | null> = [];
        combobox.subscribe('composite', (list) => lists.push(list));

        const first = combobox.attachList(setupListbox);
        combobox.setIsOpen(true);

        const second = combobox.attachList(setupListbox);
        expect(combobox.list).toBe(second.list);
        expect(second.list.isOpen).toBe(true);
        expect(lists).toEqual([first.list, second.list]);

        // The replaced list no longer receives the open state.
        combobox.setIsOpen(false);
        expect(first.list.isOpen).toBe(true);
        expect(second.list.isOpen).toBe(false);

        // A late detach of the replaced list does not unregister the current one.
        first.detach();
        expect(combobox.list).toBe(second.list);
        expect(lists).toEqual([first.list, second.list]);

        second.detach();
        expect(combobox.list).toBeNull();
        expect(lists).toEqual([first.list, second.list, null]);

        combobox.destroy();
    });

    it('should set aria-haspopup from the mounted list role, and back to listbox when a listbox replaces it', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render([], 'grid');
        combobox.registerTrigger(input);
        const grid = combobox.attachList(setupListbox);
        grid.list.mount(listElement);
        expect(input).toHaveAttribute('aria-haspopup', 'grid');

        grid.detach();
        const { listElement: listboxElement } = render([]);
        const listbox = combobox.attachList(setupListbox);
        listbox.list.mount(listboxElement);
        expect(input).toHaveAttribute('aria-haspopup', 'listbox');

        listbox.detach();
        combobox.destroy();
    });

    it('should not add the default aria-haspopup (listbox) to a trigger without it', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render([]);
        combobox.registerTrigger(input);
        const { list, detach } = combobox.attachList(setupListbox);
        list.mount(listElement);
        expect(input).not.toHaveAttribute('aria-haspopup');

        detach();
        combobox.destroy();
    });

    it('should fire expanded when the trigger aria-expanded changes', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render(['Apple']);
        const [option] = getOptions(listElement);
        combobox.registerTrigger(input);
        const changes: boolean[] = [];
        combobox.subscribe('expanded', (isExpanded) => changes.push(isExpanded));
        const { list, detach } = combobox.attachList(setupListbox);
        list.mount(listElement);

        // Open with nothing to show: not expanded.
        combobox.setIsOpen(true);
        expect(combobox.getSnapshot('expanded')).toBe(false);
        expect(changes).toEqual([]);

        // An option registers: expanded.
        const unregister = list.registerOption(option, () => undefined);
        expect(input).toHaveAttribute('aria-expanded', 'true');
        expect(changes).toEqual([true]);
        expect(combobox.getSnapshot('expanded')).toBe(true);

        // A root skeleton is something to show too.
        unregister();
        const unregisterSkeleton = list.registerSkeleton();
        expect(changes).toEqual([true, false, true]);

        combobox.setIsOpen(false);
        expect(input).toHaveAttribute('aria-expanded', 'false');
        expect(changes).toEqual([true, false, true, false]);

        unregisterSkeleton();
        detach();
        combobox.destroy();
    });

    it('should forward the list events and re-subscribe them on list change', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render(['Apple', 'Banana']);
        const options = getOptions(listElement);
        combobox.registerTrigger(input);
        combobox.setIsOpen(true);
        // Subscribed before any list attaches.
        const counts: Array<number | undefined> = [];
        const unsubscribe = combobox.subscribe('optionsChange', (state) => counts.push(state?.optionsLength));
        const activeIds: Array<string | null | undefined> = [];
        combobox.subscribe('activeDescendantChange', (id) => activeIds.push(id));
        expect(combobox.getSnapshot('optionsChange')).toBeUndefined();

        // On attach, the snapshot of the new list is dispatched (no option registered yet: undefined).
        const first = combobox.attachList(setupListbox);
        expect(counts).toEqual([undefined]);
        first.list.mount(listElement);
        options.forEach((option) => first.list.registerOption(option, () => undefined));
        expect(counts).toEqual([undefined, 1, 2]);
        expect(combobox.getSnapshot('optionsChange')).toEqual(first.list.getSnapshot('optionsChange'));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(activeIds).toEqual([undefined, 'opt-Apple']);

        // A late subscriber gets the current snapshot of the list.
        const replayed: Array<number | undefined> = [];
        combobox.subscribe('optionsChange', (state) => replayed.push(state?.optionsLength));
        expect(replayed).toEqual([2]);

        // Another list replaces the first one: its snapshot is dispatched, the first list is no longer forwarded.
        const { listElement: secondElement } = render(['Cherry']);
        const second = combobox.attachList(setupListbox);
        expect(counts).toEqual([undefined, 1, 2, undefined]);
        second.list.mount(secondElement);
        second.list.registerOption(getOptions(secondElement)[0], () => undefined);
        expect(counts).toEqual([undefined, 1, 2, undefined, 1]);
        first.list.registerOption(options[0], () => undefined);
        expect(counts).toEqual([undefined, 1, 2, undefined, 1]);
        first.detach();

        // No list: the snapshot resets.
        second.detach();
        expect(counts).toEqual([undefined, 1, 2, undefined, 1, undefined]);
        expect(combobox.getSnapshot('optionsChange')).toBeUndefined();

        // Unsubscribed: a new list no longer notifies.
        unsubscribe();
        const { listElement: thirdElement } = render([]);
        const third = combobox.attachList(setupListbox);
        third.list.mount(thirdElement);
        expect(counts).toEqual([undefined, 1, 2, undefined, 1, undefined]);

        combobox.destroy();
        third.detach();
    });

    it('should select with the list options and close on a single selection', () => {
        vi.useFakeTimers();
        try {
            const onSelect = vi.fn();
            const combobox = setupCombobox({ onSelect });
            const { input, listElement } = render(['Apple']);
            combobox.registerTrigger(input);
            const { list, detach } = combobox.attachList(setupListbox);
            list.mount(listElement);
            combobox.setIsOpen(true);

            getOptions(listElement)[0].click();
            expect(onSelect).toHaveBeenCalledWith({ value: 'Apple' });
            vi.runAllTimers();
            expect(combobox.isOpen).toBe(false);
            expect(list.isOpen).toBe(false);

            combobox.destroy();

            detach();
        } finally {
            vi.useRealTimers();
        }
    });

    it('should open an inline list (outside of a popover) on mount', () => {
        const combobox = setupCombobox({});
        const input = document.createElement('input');
        const listElement = document.createElement('ul');
        listElement.setAttribute('role', 'listbox');
        document.body.append(input, listElement);
        combobox.registerTrigger(input);
        const { list, detach } = combobox.attachList(setupListbox);
        list.mount(listElement);
        expect(combobox.alwaysOpen).toBe(true);
        expect(combobox.isOpen).toBe(true);
        expect(list.isOpen).toBe(true);
        combobox.destroy();
        detach();
    });
});
