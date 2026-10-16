// @vitest-environment jsdom
import type { CompositeEventMap } from '../Composite/types';
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
        it('should hide the options that do not match in auto mode', () => {
            const list = setupListbox();
            const { listElement, options } = render(['Apple', 'Banana', 'Cherry']);
            list.mount(listElement);
            const filtered = new Map<HTMLElement, boolean>();
            options.forEach((option) => list.registerOption(option, (isFiltered) => filtered.set(option, isFiltered)));
            const changes: Array<CompositeEventMap['optionsChange']> = [];
            list.subscribe('optionsChange', (state) => changes.push(state));

            list.setFilter('an');
            expect([...filtered.values()]).toEqual([true, false, true]);
            expect(changes[changes.length - 1]?.optionsLength).toBe(1);

            list.setFilter('');
            expect([...filtered.values()]).toEqual([false, false, false]);
            expect(changes[changes.length - 1]?.optionsLength).toBe(3);
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
    });
});
