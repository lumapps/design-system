// @vitest-environment jsdom
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
    const listElement = popover.firstElementChild as HTMLElement;
    const options = Array.from(listElement.children) as HTMLElement[];
    return { input, listElement, options };
}

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

    it('should forward the open state to the list on registration', () => {
        const combobox = setupCombobox({});
        const { input, listElement, options } = render(['Apple', 'Banana']);
        combobox.registerTrigger(input);
        const lists: Array<CompositeHandle | null> = [];
        combobox.subscribe('list', (list) => lists.push(list));

        // Open before the list registers.
        combobox.setIsOpen(true);

        const list = setupListbox(combobox.listOptions);
        expect(list.isOpen).toBe(false);
        combobox.registerList(list);
        expect(combobox.list).toBe(list);
        expect(combobox.getSnapshot('list')).toBe(list);
        expect(lists).toEqual([list]);
        expect(list.isOpen).toBe(true);
        expect(list.getSnapshot('open')).toBe(true);

        // The trigger is the focus owner of the list.
        list.mount(listElement);
        options.forEach((option) => list.registerOption(option, () => undefined));
        expect(input).toHaveAttribute('aria-expanded', 'true');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(input).toHaveAttribute('aria-activedescendant', 'opt-Apple');
        expect(listElement).not.toHaveAttribute('aria-activedescendant');

        // Closing is forwarded to the list.
        combobox.setIsOpen(false);
        expect(list.isOpen).toBe(false);
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
        list.destroy();
    });

    it('should stop forwarding to an unregistered list', () => {
        const combobox = setupCombobox({});
        const { input, listElement, options } = render(['Apple']);
        combobox.registerTrigger(input);
        const lists: Array<CompositeHandle | null> = [];
        combobox.subscribe('list', (list) => lists.push(list));

        const list = setupListbox(combobox.listOptions);
        const unregister = combobox.registerList(list);
        list.mount(listElement);
        combobox.setIsOpen(true);
        expect(list.isOpen).toBe(true);

        unregister();
        expect(combobox.list).toBeNull();
        expect(lists).toEqual([list, null]);

        // The open state is no longer forwarded.
        combobox.setIsOpen(false);
        expect(list.isOpen).toBe(true);

        // `aria-expanded` no longer follows the list options.
        combobox.setIsOpen(true);
        expect(input).toHaveAttribute('aria-expanded', 'false');
        list.registerOption(options[0], () => undefined);
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
        list.destroy();
    });

    it('should collapse the trigger when the list unregisters while open', () => {
        const combobox = setupCombobox({});
        const { input, listElement, options } = render(['Apple', 'Banana', 'Cherry']);
        combobox.registerTrigger(input);
        combobox.setIsOpen(true);

        const list = setupListbox(combobox.listOptions);
        const unregister = combobox.registerList(list);
        list.mount(listElement);
        const unregisterOptions = options.map((option) => list.registerOption(option, () => undefined));
        expect(input).toHaveAttribute('aria-expanded', 'true');

        // The list unregisters before its options (ex: React runs the parent effect cleanup first).
        unregister();
        list.destroy();
        unregisterOptions.forEach((unregisterOption) => unregisterOption());
        expect(combobox.isOpen).toBe(true);
        expect(input).toHaveAttribute('aria-expanded', 'false');

        combobox.destroy();
    });

    it('should replace the list on re-registration', () => {
        const combobox = setupCombobox({});
        const { input } = render([]);
        combobox.registerTrigger(input);
        const lists: Array<CompositeHandle | null> = [];
        combobox.subscribe('list', (list) => lists.push(list));

        const firstList = setupListbox(combobox.listOptions);
        const unregisterFirst = combobox.registerList(firstList);
        combobox.setIsOpen(true);

        const secondList = setupListbox(combobox.listOptions);
        const unregisterSecond = combobox.registerList(secondList);
        expect(combobox.list).toBe(secondList);
        expect(secondList.isOpen).toBe(true);
        expect(lists).toEqual([firstList, secondList]);

        // The replaced list no longer receives the open state.
        combobox.setIsOpen(false);
        expect(firstList.isOpen).toBe(true);
        expect(secondList.isOpen).toBe(false);

        // A late unregister of the replaced list does not unregister the current one.
        unregisterFirst();
        expect(combobox.list).toBe(secondList);
        expect(lists).toEqual([firstList, secondList]);

        // Registering the first list again.
        unregisterSecond();
        combobox.registerList(firstList);
        expect(combobox.list).toBe(firstList);
        expect(firstList.isOpen).toBe(false);
        expect(lists).toEqual([firstList, secondList, null, firstList]);

        combobox.destroy();
        firstList.destroy();
        secondList.destroy();
    });

    it('should set aria-haspopup from the mounted list role', () => {
        const combobox = setupCombobox({});
        const { input, listElement } = render([], 'grid');
        combobox.registerTrigger(input);
        const list = setupListbox(combobox.listOptions);
        combobox.registerList(list);
        list.mount(listElement);
        expect(input).toHaveAttribute('aria-haspopup', 'grid');
        combobox.destroy();
        list.destroy();
    });

    it('should select with the list options and close on a single selection', () => {
        vi.useFakeTimers();
        try {
            const onSelect = vi.fn();
            const combobox = setupCombobox({ onSelect });
            const { input, listElement, options } = render(['Apple']);
            combobox.registerTrigger(input);
            const list = setupListbox(combobox.listOptions);
            combobox.registerList(list);
            list.mount(listElement);
            combobox.setIsOpen(true);

            options[0].click();
            expect(onSelect).toHaveBeenCalledWith({ value: 'Apple' });
            vi.runAllTimers();
            expect(combobox.isOpen).toBe(false);
            expect(list.isOpen).toBe(false);

            combobox.destroy();
            list.destroy();
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
        const list = setupListbox(combobox.listOptions);
        combobox.registerList(list);
        list.mount(listElement);
        expect(combobox.alwaysOpen).toBe(true);
        expect(combobox.isOpen).toBe(true);
        expect(list.isOpen).toBe(true);
        combobox.destroy();
        list.destroy();
    });
});
