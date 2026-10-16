// @vitest-environment jsdom
import { createListFocusNavigation } from '../../utils/focusNavigation';
import { setupComposite } from './setupComposite';
import type { CompositeFilterMode, CompositeOptions, CompositeSpecialization } from './types';

const ITEM_SELECTOR = '[role="option"]';

/** Minimal specialization: a list navigation over `role="option"` items and a fixed visible count. */
function createTestSpecialization(state: { visibleCount: number; isCountHidden?: boolean }) {
    const specialization = {
        createNavigation: (element, { callbacks, signal, getActiveItem, wrap }) => ({
            type: 'listbox',
            focusNav: createListFocusNavigation(
                { type: 'list', container: element, itemSelector: ITEM_SELECTOR, wrap, getActiveItem },
                callbacks,
                signal,
            ),
            cellSelector: ITEM_SELECTOR,
            isOptionCell: () => true,
            scrollIntoView: () => undefined,
            navigateHorizontal: () => false,
        }),
        getVisibleCount: () => state.visibleCount,
        isCountHidden: () => !!state.isCountHidden,
        setFilter: vi.fn<(filterValue: string, mode: CompositeFilterMode) => void>(),
    } satisfies CompositeSpecialization<'listbox'>;
    return specialization;
}

/** Render a list of options in the document and return the list element. */
function renderList(labels: string[], attributes = '') {
    const container = document.createElement('div');
    container.innerHTML = `<ul role="listbox" ${attributes}>${labels
        .map((label) => `<li id="opt-${label}" role="option" aria-selected="false">${label}</li>`)
        .join('')}</ul>`;
    document.body.appendChild(container);
    return container.firstElementChild as HTMLElement;
}

/** Render a combobox-like focus owner (input). */
function renderInput() {
    const input = document.createElement('input');
    document.body.appendChild(input);
    return input;
}

describe(setupComposite, () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('standalone (no focus owner link)', () => {
        it('should own focus and aria-activedescendant on the mounted element', () => {
            const onSelect = vi.fn();
            const { handle } = setupComposite({ onSelect }, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            list.tabIndex = 0;
            handle.mount(list);

            expect(handle.isStandalone).toBe(true);
            expect(handle.isOpen).toBe(true);
            expect(handle.type).toBe('listbox');

            // Focus shows the visual focus on the first item.
            list.focus();
            expect(list).toHaveAttribute('aria-activedescendant', 'opt-Apple');

            // Keyboard handled on the element itself.
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(list).toHaveAttribute('aria-activedescendant', 'opt-Banana');
            expect(handle.getSnapshot('activeDescendantChange')).toBe('opt-Banana');

            // Enter selects the active item.
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(onSelect).toHaveBeenCalledWith({ value: 'Banana' }, document.getElementById('opt-Banana'));

            // Focus out clears the active item.
            list.dispatchEvent(new FocusEvent('focusout'));
            expect(list).toHaveAttribute('aria-activedescendant', '');
            expect(handle.getSnapshot('activeDescendantChange')).toBeNull();

            handle.destroy();
        });

        it('should show the selected item on focus', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            document.getElementById('opt-Banana')?.setAttribute('aria-selected', 'true');
            handle.mount(list);

            list.dispatchEvent(new FocusEvent('focus'));
            expect(list).toHaveAttribute('aria-activedescendant', 'opt-Banana');

            handle.destroy();
        });
    });

    describe('linked (focus owner link)', () => {
        it('should write aria-activedescendant on the focus owner and not handle the keyboard itself', () => {
            const input = renderInput();
            const onMount = vi.fn();
            const options: CompositeOptions = {
                focusOwner: { getFocusOwner: () => input, getInputValue: () => input.value, onMount },
            };
            const { handle } = setupComposite(options, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            handle.mount(list);

            expect(handle.isStandalone).toBe(false);
            // Closed until the parent opens it.
            expect(handle.isOpen).toBe(false);
            expect(onMount).toHaveBeenCalledWith(list);

            // Keydown on the list element is not handled (the focus owner handles the keyboard).
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(input).not.toHaveAttribute('aria-activedescendant');

            // The parent delegates the navigation keys.
            expect(handle.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))).toBe(true);
            expect(input).toHaveAttribute('aria-activedescendant', 'opt-Apple');
            expect(list).not.toHaveAttribute('aria-activedescendant');

            // Enter without an active item is not handled (lets a surrounding form submit).
            handle.focusNav?.clear();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(handle.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))).toBe(false);

            handle.destroy();
        });

        it('should dispatch open and replay it on subscribe while open', () => {
            const input = renderInput();
            const { handle } = setupComposite(
                { focusOwner: { getFocusOwner: () => input } },
                createTestSpecialization({ visibleCount: 0 }),
            );
            const changes: boolean[] = [];
            handle.subscribe('open', (isOpen) => changes.push(isOpen));
            expect(handle.getSnapshot('open')).toBe(false);

            handle.setOpen(true);
            handle.setOpen(true);
            expect(changes).toEqual([true]);

            const replayed: boolean[] = [];
            handle.subscribe('open', (isOpen) => replayed.push(isOpen));
            expect(replayed).toEqual([true]);

            handle.setOpen(false);
            expect(changes).toEqual([true, false]);
            handle.destroy();
        });
    });

    describe('optionsChange', () => {
        it('should fire with the visible count and the hidden count state of the specialization', () => {
            const state = { visibleCount: 0, isCountHidden: false };
            const specialization = createTestSpecialization(state);
            const { handle, notifyOptionsChange } = setupComposite({}, specialization);
            const changes: unknown[] = [];
            handle.subscribe('optionsChange', (value) => changes.push(value));

            // No change: not fired.
            notifyOptionsChange();
            expect(changes).toEqual([]);

            state.visibleCount = 3;
            notifyOptionsChange();
            expect(changes).toEqual([{ optionsLength: 3, inputValue: '', isCountHidden: false }]);
            expect(handle.hasVisibleContent).toBe(true);

            state.isCountHidden = true;
            notifyOptionsChange();
            expect(changes).toHaveLength(2);
            expect(handle.getSnapshot('optionsChange')).toEqual({
                optionsLength: 3,
                inputValue: '',
                isCountHidden: true,
            });
            handle.destroy();
        });

        it('should let the specialization apply the filter, then fire optionsChange', () => {
            const state = { visibleCount: 3 };
            const specialization = createTestSpecialization(state);
            specialization.setFilter.mockImplementation(() => {
                state.visibleCount = 1;
            });
            const { handle } = setupComposite({}, specialization);
            const changes: unknown[] = [];
            handle.subscribe('optionsChange', (value) => changes.push(value));

            handle.setFilter('app');
            expect(specialization.setFilter).toHaveBeenCalledWith('app', 'auto');
            expect(changes).toEqual([{ optionsLength: 1, inputValue: '', isCountHidden: false }]);

            handle.setFilter('app', 'manual');
            expect(specialization.setFilter).toHaveBeenLastCalledWith('app', 'manual');
            handle.destroy();
        });
    });

    describe('skeletons and loading', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it('should make the composite busy with root skeletons and announce loading after a delay', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 0 }));
            const loadingChanges: boolean[] = [];
            const announcements: boolean[] = [];
            handle.subscribe('loadingChange', (value) => loadingChanges.push(value));
            handle.subscribe('loadingAnnouncement', (value) => announcements.push(value));

            const unregister1 = handle.registerSkeleton();
            const unregister2 = handle.registerSkeleton();
            expect(handle.isLoading).toBe(true);
            expect(handle.hasVisibleContent).toBe(true);
            expect(loadingChanges).toEqual([true]);

            // Standalone: open from creation, the announcement fires after the delay.
            vi.advanceTimersByTime(499);
            expect(announcements).toEqual([]);
            vi.advanceTimersByTime(1);
            expect(announcements).toEqual([true]);

            // Replayed on subscribe while loading.
            const replayed: boolean[] = [];
            handle.subscribe('loadingChange', (value) => replayed.push(value));
            expect(replayed).toEqual([true]);

            unregister1();
            expect(loadingChanges).toEqual([true]);
            unregister2();
            expect(loadingChanges).toEqual([true, false]);
            expect(announcements).toEqual([true, false]);
            expect(handle.isLoading).toBe(false);
            handle.destroy();
        });

        it('should not make the composite busy with nested skeletons, but announce loading', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const loadingChanges: boolean[] = [];
            const announcements: boolean[] = [];
            handle.subscribe('loadingChange', (value) => loadingChanges.push(value));
            handle.subscribe('loadingAnnouncement', (value) => announcements.push(value));

            const unregister = handle.registerSkeleton({ isNested: true });
            expect(handle.isLoading).toBe(false);
            expect(loadingChanges).toEqual([]);

            vi.advanceTimersByTime(500);
            expect(announcements).toEqual([true]);

            unregister();
            expect(loadingChanges).toEqual([]);
            expect(announcements).toEqual([true, false]);
            handle.destroy();
        });

        it('should only announce loading while open (linked)', () => {
            const input = renderInput();
            const { handle } = setupComposite(
                { focusOwner: { getFocusOwner: () => input } },
                createTestSpecialization({ visibleCount: 0 }),
            );
            const announcements: boolean[] = [];
            handle.subscribe('loadingAnnouncement', (value) => announcements.push(value));

            const unregister = handle.registerSkeleton();
            vi.advanceTimersByTime(500);
            expect(announcements).toEqual([]);

            handle.setOpen(true);
            vi.advanceTimersByTime(500);
            expect(announcements).toEqual([true]);

            // Closing retracts the announcement.
            handle.setOpen(false);
            expect(announcements).toEqual([true, false]);

            unregister();
            expect(announcements).toEqual([true, false]);
            handle.destroy();
        });
    });

    it('should clear the specialization state on destroy', () => {
        const specialization = { ...createTestSpecialization({ visibleCount: 0 }), destroy: vi.fn() };
        const { handle } = setupComposite({}, specialization);
        handle.destroy();
        expect(specialization.destroy).toHaveBeenCalledOnce();
    });
});
