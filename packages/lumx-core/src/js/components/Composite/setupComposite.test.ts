// @vitest-environment jsdom
import { screen } from '@testing-library/dom';
import { createListFocusNavigation } from '../../utils/focusNavigation';
import { setupComposite } from './setupComposite';
import { optionActiveEvent } from './constants';
import { CLASSNAME as STATUS_CLASSNAME } from './CompositeStatus';
import type { CompositeFilter, CompositeOptions, CompositeSpecialization } from './types';

const ITEM_SELECTOR = '[role="option"]';

/** Minimal specialization: a list navigation over `role="option"` items and a fixed visible count. */
function createTestSpecialization(state: { visibleCount: number; isCountHidden?: boolean }) {
    const specialization = {
        createNavigation: ({ container, callbacks, signal, getActiveItem, wrap }) => ({
            type: 'listbox',
            focusNav: createListFocusNavigation(
                { type: 'list', container, itemSelector: ITEM_SELECTOR, wrap, getActiveItem },
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
        applyFilter: vi.fn<(filter: CompositeFilter) => void>(),
    } satisfies CompositeSpecialization;
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
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            list.tabIndex = 0;
            handle.mount(list);

            expect(handle.isStandalone).toBe(true);
            expect(handle.isOpen).toBe(true);

            // Keyboard handled on the element itself.
            list.focus();
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(list).toHaveAttribute('aria-activedescendant', 'opt-Banana');
            expect(handle.getSnapshot('activeDescendantChange')).toBe('opt-Banana');

            // Focus out clears the active item.
            list.dispatchEvent(new FocusEvent('focusout'));
            expect(list).toHaveAttribute('aria-activedescendant', '');
            expect(handle.getSnapshot('activeDescendantChange')).toBeNull();

            handle.destroy();
        });

        it('should show the selected item on focus', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            screen.getByRole('option', { name: 'Banana' }).setAttribute('aria-selected', 'true');
            handle.mount(list);

            list.dispatchEvent(new FocusEvent('focus'));
            expect(list).toHaveAttribute('aria-activedescendant', 'opt-Banana');

            handle.destroy();
        });
    });

    describe('linked (focus owner link)', () => {
        it('should write aria-activedescendant on the focus owner and not handle the keyboard itself', () => {
            const input = renderInput();
            const options: CompositeOptions = {
                focusOwner: { getFocusOwner: () => input, getInputValue: () => input.value },
            };
            const { handle } = setupComposite(options, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            handle.mount(list);

            expect(handle.isStandalone).toBe(false);
            // Closed until the parent opens it.
            expect(handle.isOpen).toBe(false);

            // Keydown on the list element is not handled (the focus owner handles the keyboard).
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(input).not.toHaveAttribute('aria-activedescendant');

            // The parent delegates the navigation keys.
            expect(handle.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))).toBe(true);
            expect(input).toHaveAttribute('aria-activedescendant', 'opt-Apple');
            expect(list).not.toHaveAttribute('aria-activedescendant');

            // Enter without an active item is not handled (lets a surrounding form submit).
            handle.clearActiveItem();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(handle.handleKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))).toBe(false);

            handle.destroy();
        });

        it('should activate the selected item or an edge item, and keep the intent until the items render', () => {
            const input = renderInput();
            const { handle } = setupComposite(
                { focusOwner: { getFocusOwner: () => input } },
                createTestSpecialization({ visibleCount: 3 }),
            );
            const list = renderList(['Apple', 'Banana', 'Cherry']);
            handle.mount(list);

            handle.activateDefaultItem('last');
            expect(handle.activeItem).toHaveAttribute('id', 'opt-Cherry');
            expect(input).toHaveAttribute('aria-activedescendant', 'opt-Cherry');

            // The selected item wins over the edge item.
            screen.getByRole('option', { name: 'Banana' }).setAttribute('aria-selected', 'true');
            handle.activateDefaultItem('first');
            expect(handle.activeItem).toHaveAttribute('id', 'opt-Banana');

            handle.setActiveItem(screen.getByRole('option', { name: 'Apple' }));
            expect(handle.activeItem).toHaveAttribute('id', 'opt-Apple');

            handle.clearActiveItem();
            expect(handle.activeItem).toBeNull();

            // No item rendered yet (e.g. a combobox popup that opens): the intent waits for the items.
            const options = [...list.children];
            list.replaceChildren();
            handle.activateDefaultItem('first');
            expect(handle.activeItem).toBeNull();
            list.append(...options);
            handle.flushPendingNavigation();
            expect(handle.activeItem).toHaveAttribute('id', 'opt-Banana');

            handle.destroy();
            expect(handle.activeItem).toBeNull();
        });

        it('should consume ArrowLeft and ArrowRight only when the navigation moved (standalone: always)', () => {
            // The test navigation never moves horizontally (like the list pattern).
            const input = renderInput();
            const linked = setupComposite(
                { focusOwner: { getFocusOwner: () => input } },
                createTestSpecialization({ visibleCount: 1 }),
            ).handle;
            linked.mount(renderList(['Apple']));
            linked.setOpen(true);
            linked.activateDefaultItem('first');
            // Linked: the focus owner (e.g. the combobox input) keeps the key to move its caret.
            expect(linked.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))).toBe(false);
            expect(linked.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))).toBe(false);
            linked.destroy();

            // Standalone: the arrow keys never leak to the page.
            const standalone = setupComposite({}, createTestSpecialization({ visibleCount: 1 })).handle;
            standalone.mount(renderList(['Banana']));
            expect(standalone.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))).toBe(true);
            expect(standalone.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))).toBe(true);
            standalone.destroy();
        });

        it('should dispatch open, with the open state as snapshot', () => {
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

            // A late subscriber reads the snapshot (no replay on subscribe).
            const late: boolean[] = [];
            handle.subscribe('open', (isOpen) => late.push(isOpen));
            expect(late).toEqual([]);
            expect(handle.getSnapshot('open')).toBe(true);

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

        it('should store the filter, let the specialization apply it, then fire optionsChange', () => {
            const state = { visibleCount: 3 };
            const specialization = createTestSpecialization(state);
            const { handle, getFilter } = setupComposite({}, specialization);
            specialization.applyFilter.mockImplementation((filter) => {
                state.visibleCount = filter.value ? 1 : 3;
            });
            const changes: unknown[] = [];
            handle.subscribe('optionsChange', (value) => changes.push(value));
            expect(getFilter()).toEqual({ value: '', mode: 'auto' });

            handle.setFilter('app');
            expect(getFilter()).toEqual({ value: 'app', mode: 'auto' });
            expect(changes).toEqual([{ optionsLength: 1, inputValue: '', isCountHidden: false }]);

            handle.setFilter('app', 'manual');
            expect(getFilter()).toEqual({ value: 'app', mode: 'manual' });

            // Destroy resets the filter.
            handle.destroy();
            expect(getFilter()).toEqual({ value: '', mode: 'auto' });
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
            expect(handle.getSnapshot('loadingChange')).toBe(true);
            expect(handle.hasVisibleContent).toBe(true);
            expect(loadingChanges).toEqual([true]);

            // Standalone: open from creation, the announcement fires after the delay.
            vi.advanceTimersByTime(499);
            expect(announcements).toEqual([]);
            vi.advanceTimersByTime(1);
            expect(announcements).toEqual([true]);

            unregister1();
            expect(loadingChanges).toEqual([true]);
            unregister2();
            expect(loadingChanges).toEqual([true, false]);
            expect(announcements).toEqual([true, false]);
            expect(handle.getSnapshot('loadingChange')).toBe(false);
            handle.destroy();
        });

        it('should ignore a skeleton cleanup called twice, or after a destroy', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 0 }));
            const unregister = handle.registerSkeleton();
            handle.destroy();
            // A stale cleanup (e.g. a child effect cleanup after the destroy) changes nothing.
            unregister();
            const unregisterAgain = handle.registerSkeleton();
            expect(handle.getSnapshot('loadingChange')).toBe(true);
            unregister();
            expect(handle.getSnapshot('loadingChange')).toBe(true);
            unregisterAgain();
            unregisterAgain();
            expect(handle.getSnapshot('loadingChange')).toBe(false);
            handle.destroy();
        });

        it('should not make the composite busy with nested skeletons, but announce loading', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const loadingChanges: boolean[] = [];
            handle.subscribe('loadingChange', (value) => loadingChanges.push(value));

            const unregister = handle.registerSkeleton({ isNested: true });
            expect(loadingChanges).toEqual([]);

            vi.advanceTimersByTime(500);
            expect(handle.getSnapshot('loadingAnnouncement')).toBe(true);

            unregister();
            expect(loadingChanges).toEqual([]);
            expect(handle.getSnapshot('loadingAnnouncement')).toBe(false);
            handle.destroy();
        });

        it('should only announce loading while open (linked), and again on each open', () => {
            const input = renderInput();
            const { handle } = setupComposite(
                { focusOwner: { getFocusOwner: () => input } },
                createTestSpecialization({ visibleCount: 0 }),
            );
            const isAnnounced = () => handle.getSnapshot('loadingAnnouncement') ?? false;

            // Skeletons registered and unregistered while closed: no announcement.
            handle.registerSkeleton()();
            vi.advanceTimersByTime(500);
            expect(isAnnounced()).toBe(false);

            const unregister = handle.registerSkeleton();
            vi.advanceTimersByTime(500);
            expect(isAnnounced()).toBe(false);

            handle.setOpen(true);
            vi.advanceTimersByTime(499);
            expect(isAnnounced()).toBe(false);
            vi.advanceTimersByTime(1);
            expect(isAnnounced()).toBe(true);

            // Closing retracts the announcement.
            handle.setOpen(false);
            expect(isAnnounced()).toBe(false);

            // Reopen while still loading: announced again after the delay.
            handle.setOpen(true);
            expect(isAnnounced()).toBe(false);
            vi.advanceTimersByTime(500);
            expect(isAnnounced()).toBe(true);

            unregister();
            expect(isAnnounced()).toBe(false);
            handle.destroy();
        });
    });

    describe('hidden (no visible content)', () => {
        it('should hide the mounted element without visible items or root skeletons', () => {
            const state = { visibleCount: 0 };
            const { handle, notifyOptionsChange } = setupComposite({}, createTestSpecialization(state));
            const list = renderList([]);
            handle.mount(list);
            expect(list).toHaveAttribute('hidden');
            expect(handle.hasVisibleContent).toBe(false);

            state.visibleCount = 2;
            notifyOptionsChange();
            expect(list).not.toHaveAttribute('hidden');

            state.visibleCount = 0;
            notifyOptionsChange();
            expect(list).toHaveAttribute('hidden');

            // A root skeleton is visible content.
            const unregister = handle.registerSkeleton();
            expect(list).not.toHaveAttribute('hidden');
            expect(handle.hasVisibleContent).toBe(true);
            unregister();
            expect(list).toHaveAttribute('hidden');

            // A nested skeleton is visible only under a visible item: not visible content alone.
            const unregisterNested = handle.registerSkeleton({ isNested: true });
            expect(list).toHaveAttribute('hidden');
            expect(handle.hasVisibleContent).toBe(false);
            unregisterNested();
            handle.destroy();
        });

        it('should keep the mounted element visible when it holds a status (the live region)', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 0 }));
            const list = renderList([]);
            list.innerHTML = `<li class="${STATUS_CLASSNAME}" role="status"></li>`;
            handle.mount(list);
            expect(list).not.toHaveAttribute('hidden');
            expect(handle.hasVisibleContent).toBe(false);
            handle.destroy();
        });

        it('should hide the mounted element when its only status is in a hidden subtree', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 0 }));
            const list = renderList([]);
            list.innerHTML = `<li role="none"><ul hidden><li class="${STATUS_CLASSNAME}"></li></ul></li>`;
            handle.mount(list);
            expect(list).toHaveAttribute('hidden');
            handle.destroy();
        });
    });

    describe('per-item active events', () => {
        it('should notify the previous and the new active item, with the active state as snapshot', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const list = renderList(['Apple', 'Banana']);
            list.tabIndex = 0;
            handle.mount(list);
            const apple: boolean[] = [];
            const banana: boolean[] = [];
            const unsubscribeApple = handle.subscribe(optionActiveEvent('opt-Apple'), (value) => apple.push(value));
            handle.subscribe(optionActiveEvent('opt-Banana'), (value) => banana.push(value));

            // Focus activates the first item.
            list.focus();
            expect(apple).toEqual([true]);
            expect(banana).toEqual([]);
            expect(handle.getSnapshot(optionActiveEvent('opt-Apple'))).toBe(true);
            expect(handle.getSnapshot(optionActiveEvent('opt-Banana'))).toBe(false);

            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(apple).toEqual([true, false]);
            expect(banana).toEqual([true]);
            expect(handle.getSnapshot(optionActiveEvent('opt-Banana'))).toBe(true);

            // An unsubscribed item is not notified any more.
            unsubscribeApple();
            list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
            expect(apple).toEqual([true, false]);
            expect(banana).toEqual([true, false]);
            expect(handle.getSnapshot(optionActiveEvent('opt-Apple'))).toBe(true);
            handle.destroy();
        });
    });

    describe('mount', () => {
        it('should do nothing when the same element mounts again, and ignore the cleanup of a replaced element', () => {
            const { handle } = setupComposite({}, createTestSpecialization({ visibleCount: 2 }));
            const first = renderList(['Apple']);
            const cleanupFirst = handle.mount(first);
            handle.mount(first);
            expect(handle.element).toBe(first);

            const second = renderList(['Banana', 'Cherry']);
            second.tabIndex = 0;
            handle.mount(second);
            // The stale cleanup of the first element (e.g. a React StrictMode effect) keeps the second one.
            cleanupFirst();
            expect(handle.element).toBe(second);
            second.focus();
            second.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
            expect(second).toHaveAttribute('aria-activedescendant', 'opt-Cherry');
            handle.destroy();
        });
    });
});
