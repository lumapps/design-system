// @vitest-environment jsdom
import { within } from '@testing-library/dom';
import type { CompositeEventMap } from '../Composite/types';
import type { SectionState } from './types';
import { setupListbox } from './setupListbox';

/** Render a standalone listbox with one option per label. */
function render(labels: string[]) {
    const listElement = document.createElement('ul');
    listElement.setAttribute('role', 'listbox');
    listElement.innerHTML = labels
        .map((label) => `<li id="opt-${label}" role="option" aria-selected="false">${label}</li>`)
        .join('');
    document.body.append(listElement);
    return { listElement, options: Array.from(listElement.children) as HTMLElement[] };
}

describe(setupListbox, () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('setFilter', () => {
        it('should hide the options that do not match in auto mode (ignoring case), and the list without a match', () => {
            const list = setupListbox();
            const { listElement, options } = render(['Apple', 'Banana', 'Cherry']);
            list.mount(listElement);
            const filtered = new Map<HTMLElement, boolean>();
            options.forEach((option) => list.registerOption(option, (isFiltered) => filtered.set(option, isFiltered)));
            const changes: Array<CompositeEventMap['optionsChange']> = [];
            list.subscribe('optionsChange', (state) => changes.push(state));
            expect(listElement).not.toHaveAttribute('hidden');

            list.setFilter('AN');
            expect([...filtered.values()]).toEqual([true, false, true]);
            expect(changes[changes.length - 1]?.optionsLength).toBe(1);

            // No match: the list element is hidden.
            list.setFilter('zzz');
            expect([...filtered.values()]).toEqual([true, true, true]);
            expect(changes[changes.length - 1]?.optionsLength).toBe(0);
            expect(listElement).toHaveAttribute('hidden');

            list.setFilter('');
            expect([...filtered.values()]).toEqual([false, false, false]);
            expect(changes[changes.length - 1]?.optionsLength).toBe(3);
            expect(listElement).not.toHaveAttribute('hidden');
            list.destroy();
        });

        it('should hide no option in manual mode (the consumer filters the options)', () => {
            const list = setupListbox();
            const { listElement, options } = render(['Apple', 'Banana', 'Cherry']);
            list.mount(listElement);
            const filtered = new Map<HTMLElement, boolean>();
            options.forEach((option) => list.registerOption(option, (isFiltered) => filtered.set(option, isFiltered)));

            list.setFilter('an', 'manual');
            expect([...filtered.values()]).toEqual([false, false, false]);
            expect(list.getSnapshot('optionsChange')?.optionsLength).toBe(3);

            // Options registered while filtering in manual mode are not hidden either.
            const { options: lateOptions } = render(['Date']);
            list.registerOption(lateOptions[0], (isFiltered) => filtered.set(lateOptions[0], isFiltered));
            expect(filtered.get(lateOptions[0])).toBe(false);
            list.destroy();
        });

        it('should refilter an option whose value changed', () => {
            const list = setupListbox();
            const { listElement, options } = render(['Apple', 'Banana']);
            list.mount(listElement);
            const filtered = new Map<HTMLElement, boolean>();
            options.forEach((option) => list.registerOption(option, (isFiltered) => filtered.set(option, isFiltered)));
            list.setFilter('ch');
            expect([...filtered.values()]).toEqual([true, true]);
            expect(list.getSnapshot('optionsChange')?.optionsLength ?? 0).toBe(0);

            const banana = within(listElement).getByRole('option', { name: 'Banana', hidden: true });
            banana.textContent = 'Cherry';
            list.refilterOption(banana);
            expect(filtered.get(banana)).toBe(false);
            expect(list.getSnapshot('optionsChange')?.optionsLength).toBe(1);
            list.destroy();
        });
    });

    describe('registerSection', () => {
        it('should hide a section whose options are all filtered out', () => {
            const list = setupListbox();
            const listElement = document.createElement('ul');
            listElement.setAttribute('role', 'listbox');
            listElement.innerHTML = `
                <li role="none"><ul role="group" aria-label="Fruits"><li role="option" aria-selected="false">Apple</li></ul></li>
                <li role="none"><ul role="group" aria-label="Others"><li role="option" aria-selected="false">Banana</li></ul></li>`;
            document.body.append(listElement);
            list.mount(listElement);
            const fruits = within(listElement).getByRole('group', { name: 'Fruits', hidden: true });
            const others = within(listElement).getByRole('group', { name: 'Others', hidden: true });
            const states = new Map<HTMLElement, SectionState>();
            list.registerSection(fruits, (state) => states.set(fruits, state));
            list.registerSection(others, (state) => states.set(others, state));
            within(listElement)
                .getAllByRole('option', { hidden: true })
                .forEach((option) => list.registerOption(option, () => undefined));
            expect(states.get(fruits)).toEqual({ hidden: false, 'aria-hidden': false });
            expect(states.get(others)).toEqual({ hidden: false, 'aria-hidden': false });

            list.setFilter('ban');
            expect(states.get(fruits)).toEqual({ hidden: true, 'aria-hidden': false });
            expect(states.get(others)).toEqual({ hidden: false, 'aria-hidden': false });

            list.setFilter('');
            expect(states.get(fruits)).toEqual({ hidden: false, 'aria-hidden': false });
            list.destroy();
        });
    });

    it('should forget the registered options on destroy', () => {
        const list = setupListbox();
        const { listElement, options } = render(['Apple', 'Banana']);
        list.mount(listElement);
        const onFiltered = vi.fn();
        list.registerOption(options[0], onFiltered);
        list.destroy();
        onFiltered.mockClear();
        // A kept registration would be notified (filtered out) and counted.
        list.setFilter('zzz');
        expect(onFiltered).not.toHaveBeenCalled();
        list.setFilter('');
        expect(list.getSnapshot('optionsChange')?.optionsLength ?? 0).toBe(0);
    });
});
