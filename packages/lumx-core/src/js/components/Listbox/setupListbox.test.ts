// @vitest-environment jsdom
import { CLASSNAME as STATUS_CLASSNAME } from './ListboxState';
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

    describe('hidden (no visible content)', () => {
        it('should hide the list without a matching option', () => {
            const list = setupListbox();
            const { listElement, options } = render(['Apple', 'Banana', 'Cherry']);
            list.mount(listElement);
            options.forEach((option) => list.registerOption(option, () => {}));
            expect(listElement).not.toHaveAttribute('hidden');

            list.setFilter('zzz');
            expect(listElement).toHaveAttribute('hidden');
            expect(list.hasVisibleContent).toBe(false);

            list.setFilter('');
            expect(listElement).not.toHaveAttribute('hidden');
            list.destroy();
        });

        it('should hide the list without options or skeletons', () => {
            const list = setupListbox();
            const { listElement } = render([]);
            list.mount(listElement);
            expect(listElement).toHaveAttribute('hidden');

            // A skeleton is visible content.
            const unregister = list.registerSkeleton();
            expect(listElement).not.toHaveAttribute('hidden');
            unregister();
            expect(listElement).toHaveAttribute('hidden');
            list.destroy();
        });

        it('should keep the list visible when it holds a status (the live region)', () => {
            const list = setupListbox();
            const { listElement } = render([]);
            listElement.innerHTML = `<li class="${STATUS_CLASSNAME}" role="status"></li>`;
            list.mount(listElement);
            expect(listElement).not.toHaveAttribute('hidden');
            expect(list.hasVisibleContent).toBe(false);
            list.destroy();
        });

        it('should hide the list when its only status is in a hidden subtree', () => {
            const list = setupListbox();
            const { listElement } = render([]);
            listElement.innerHTML = `<li role="none"><ul hidden><li class="${STATUS_CLASSNAME}"></li></ul></li>`;
            list.mount(listElement);
            expect(listElement).toHaveAttribute('hidden');
            list.destroy();
        });
    });
});
