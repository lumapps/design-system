// @vitest-environment jsdom
import { setupRovingTabIndex } from './setupRovingTabIndex';

function createContainer(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    document.body.appendChild(div);
    return div.firstElementChild as HTMLElement;
}

function createTabList(count: number): HTMLElement {
    const items = Array.from({ length: count }, (_, i) => {
        const tabindex = i === 0 ? '0' : '-1';
        return `<button role="tab" id="tab-${i}" tabindex="${tabindex}">Tab ${i}</button>`;
    }).join('');
    return createContainer(`<div role="tablist">${items}</div>`);
}

/** Wait for MutationObserver callbacks to flush (they are microtask-based). */
async function flushObservers(): Promise<void> {
    // MutationObserver callbacks are dispatched as microtasks.
    await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
    });
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('setupRovingTabIndex', () => {
    describe('basic setup', () => {
        it('should silently adopt the item with tabindex="0" as active', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');
        });

        it('should return a focus navigation controller', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.type).toBe('list');
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.hasNavigableItems).toBe(true);
        });
    });

    describe('item removal recovery (MutationObserver)', () => {
        it('should move tabindex="0" to the next sibling when active item is removed (container has focus)', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const onItemFocused = vi.fn();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]', onItemFocused }, ac.signal);

            // Navigate to the middle item.
            nav.goToItem(container.querySelector('#tab-1') as HTMLElement);
            expect(nav.activeItem?.id).toBe('tab-1');
            onItemFocused.mockClear();

            // Simulate container having focus by focusing the active item.
            (container.querySelector('#tab-1') as HTMLElement).focus();

            // Remove the active item.
            container.querySelector('#tab-1')!.remove();
            await flushObservers();

            // The next sibling (tab-2) should now be active with tabindex="0" and focused.
            expect(nav.activeItem?.id).toBe('tab-2');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('tab-2');
            expect(onItemFocused).toHaveBeenCalledWith(container.querySelector('#tab-2'));
        });

        it('should move tabindex="0" to the previous sibling when last item is removed (container has focus)', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Navigate to the last item.
            nav.goToItem(container.querySelector('#tab-2') as HTMLElement);
            expect(nav.activeItem?.id).toBe('tab-2');

            // Simulate container having focus.
            (container.querySelector('#tab-2') as HTMLElement).focus();

            // Remove the last item.
            container.querySelector('#tab-2')!.remove();
            await flushObservers();

            // The previous sibling (tab-1) should now be active.
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('tab-1');
        });

        it('should set tabindex="0" without focusing when container does not have focus', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const onItemFocused = vi.fn();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]', onItemFocused }, ac.signal);

            // Navigate to the middle item.
            nav.goToItem(container.querySelector('#tab-1') as HTMLElement);
            expect(nav.activeItem?.id).toBe('tab-1');
            onItemFocused.mockClear();

            // Focus something outside the container to simulate no focus inside.
            const externalButton = document.createElement('button');
            externalButton.id = 'external';
            document.body.appendChild(externalButton);
            externalButton.focus();
            expect(document.activeElement?.id).toBe('external');

            // Remove the active item.
            container.querySelector('#tab-1')!.remove();
            await flushObservers();

            // The next sibling (tab-2) should have tabindex="0" but NOT be focused.
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('external');
            // The fallback item has tabindex="0", so getActiveItem reads it from DOM.
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-2');
            // onItemFocused should NOT have been called.
            expect(onItemFocused).not.toHaveBeenCalled();
        });

        it('should handle removal of all items gracefully', async () => {
            const container = createTabList(2);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Focus the active item.
            (container.querySelector('#tab-0') as HTMLElement).focus();

            // Remove all items.
            container.querySelector('#tab-0')!.remove();
            container.querySelector('#tab-1')!.remove();
            await flushObservers();

            // No fallback available — nav should be cleared.
            expect(nav.hasActiveItem).toBe(false);
            expect(nav.activeItem).toBeNull();
        });

        it('should not react when a non-active item is removed', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Remove a non-active item.
            container.querySelector('#tab-2')!.remove();
            await flushObservers();

            // Active item should be unchanged.
            expect(nav.activeItem?.id).toBe('tab-0');
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
        });

        it('should skip disabled items when finding a fallback', async () => {
            const container = createTabList(4);
            const disabledSelector = '[aria-disabled="true"]';
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: disabledSelector,
                },
                ac.signal,
            );

            // Navigate to tab-1.
            nav.goToItem(container.querySelector('#tab-1') as HTMLElement);
            expect(nav.activeItem?.id).toBe('tab-1');

            // Mark tab-2 as disabled.
            container.querySelector('#tab-2')!.setAttribute('aria-disabled', 'true');

            // Focus the active item.
            (container.querySelector('#tab-1') as HTMLElement).focus();

            // Remove the active item.
            container.querySelector('#tab-1')!.remove();
            await flushObservers();

            // tab-2 is disabled, so fallback should be tab-3.
            expect(nav.activeItem?.id).toBe('tab-3');
            expect(container.querySelector('#tab-3')!.getAttribute('tabindex')).toBe('0');
        });

        it('should recover correctly when the first item is removed', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Focus the first (active) item.
            (container.querySelector('#tab-0') as HTMLElement).focus();

            // Remove it.
            container.querySelector('#tab-0')!.remove();
            await flushObservers();

            // Next sibling (tab-1) should become active.
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('tab-1');
        });

        it('should disconnect observer on abort', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Focus the active item.
            (container.querySelector('#tab-0') as HTMLElement).focus();

            // Abort — tears down everything.
            ac.abort();

            // Remove the (formerly) active item.
            container.querySelector('#tab-0')!.remove();
            await flushObservers();

            // Observer is disconnected — no recovery should happen.
            // tab-1 should NOT have tabindex="0" set by the observer.
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should handle removal of a wrapper containing the active item', async () => {
            // Items are inside wrapper divs — the wrapper is what gets removed.
            const container = createContainer(`
                <div role="tablist">
                    <div class="wrapper" id="w0"><button role="tab" id="tab-0" tabindex="0">Tab 0</button></div>
                    <div class="wrapper" id="w1"><button role="tab" id="tab-1" tabindex="-1">Tab 1</button></div>
                    <div class="wrapper" id="w2"><button role="tab" id="tab-2" tabindex="-1">Tab 2</button></div>
                </div>
            `);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Focus the active item.
            (container.querySelector('#tab-0') as HTMLElement).focus();

            // Remove the wrapper containing the active item.
            container.querySelector('#w0')!.remove();
            await flushObservers();

            // The next wrapper's tab should become active.
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('tab-1');
        });

        it('should not steal focus when active item is removed programmatically and document.activeElement is body', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const onItemFocused = vi.fn();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]', onItemFocused }, ac.signal);

            // The container never received focus — activeElement is body.
            expect(document.activeElement).toBe(document.body);
            onItemFocused.mockClear();

            // Remove the active item programmatically.
            container.querySelector('#tab-0')!.remove();
            await flushObservers();

            // Should silently set tabindex="0" on fallback without stealing focus.
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement).toBe(document.body);
            // The fallback item has tabindex="0", so getActiveItem reads it from DOM.
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(onItemFocused).not.toHaveBeenCalled();
        });
    });

    describe('mount normalization', () => {
        it('should keep only the first tabindex="0" when multiple items have tabindex="0"', () => {
            // Simulates ChipGroup where all clickable chips start with tabindex="0".
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0" tabindex="0">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="0">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="0">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should assign tabindex="0" to the first enabled item when none have tabindex="0"', () => {
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0" tabindex="-1">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="-1">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="-1">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should set tabindex="-1" on disabled items on mount', () => {
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0" tabindex="0" aria-disabled="true">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="0">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="-1">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );

            // tab-0 is disabled — must be tabindex="-1".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            // tab-1 is the first enabled item — gets tabindex="0".
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should assign tabindex="0" to first enabled item when all items start without tabindex', () => {
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0">Tab 0</button>
                    <button role="tab" id="tab-1">Tab 1</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // First item should get tabindex="0", second should get "-1".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should prefer aria-selected="true" item as the tab stop when none have tabindex="0"', () => {
            const container = createContainer(`
                <div role="tablist">
                    <button role="tab" id="tab-0" tabindex="-1" aria-selected="false">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="-1" aria-selected="true">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="-1" aria-selected="false">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Tab 1 has aria-selected="true" — it should get tabindex="0".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should re-normalize tabindex when aria-selected changes on an item', async () => {
            const container = createContainer(`
                <div role="tablist">
                    <button role="tab" id="tab-0" tabindex="0" aria-selected="true">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="-1" aria-selected="false">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="-1" aria-selected="false">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Initial state: tab-0 has tabindex="0".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');

            // Simulate framework re-render: aria-selected moves to tab-2.
            container.querySelector('#tab-0')!.setAttribute('aria-selected', 'false');
            container.querySelector('#tab-2')!.setAttribute('aria-selected', 'true');
            await flushObservers();

            // Tabindex should follow aria-selected.
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('0');
        });

        it('should skip disabled items when assigning the initial tabindex="0"', () => {
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0" aria-disabled="true">Tab 0</button>
                    <button role="tab" id="tab-1" aria-disabled="true">Tab 1</button>
                    <button role="tab" id="tab-2">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );

            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('0');
        });
    });

    describe('item insertion normalization (MutationObserver)', () => {
        it('should set tabindex="-1" on a new item when an active item already exists', async () => {
            const container = createTabList(2);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Add a new item.
            const newItem = document.createElement('button');
            newItem.setAttribute('role', 'tab');
            newItem.id = 'tab-new';
            newItem.tabIndex = 0; // Consumer sets tabindex="0" (e.g., ChipGroup pattern).
            container.appendChild(newItem);
            await flushObservers();

            // New item should be normalized to tabindex="-1".
            expect(newItem.getAttribute('tabindex')).toBe('-1');
            // Original active item is unchanged.
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
        });

        it('should set tabindex="0" on first inserted item when no active item exists', async () => {
            // Start with an empty container.
            const container = createContainer('<div role="tablist"></div>');
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Insert a new item.
            const newItem = document.createElement('button');
            newItem.setAttribute('role', 'tab');
            newItem.id = 'tab-new';
            newItem.setAttribute('tabindex', '-1');
            container.appendChild(newItem);
            await flushObservers();

            // Should become the tab stop since no other item exists.
            expect(newItem.getAttribute('tabindex')).toBe('0');
        });

        it('should set tabindex="-1" on a new disabled item', async () => {
            const container = createTabList(2);
            const ac = new AbortController();
            setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );

            // Add a new disabled item.
            const newItem = document.createElement('button');
            newItem.setAttribute('role', 'tab');
            newItem.setAttribute('aria-disabled', 'true');
            newItem.id = 'tab-disabled';
            newItem.setAttribute('tabindex', '0');
            container.appendChild(newItem);
            await flushObservers();

            // Disabled item should be forced to tabindex="-1".
            expect(newItem.getAttribute('tabindex')).toBe('-1');
        });

        it('should normalize items inside an inserted wrapper element', async () => {
            const container = createTabList(2);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Insert a wrapper containing a new item with tabindex="0".
            const wrapper = document.createElement('div');
            wrapper.innerHTML = '<button role="tab" id="tab-nested" tabindex="0">Nested</button>';
            container.appendChild(wrapper);
            await flushObservers();

            // Nested item should be normalized to tabindex="-1".
            expect(container.querySelector('#tab-nested')!.getAttribute('tabindex')).toBe('-1');
            // Original active item unchanged.
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
        });

        it('should set tabindex="0" on first inserted item after all items were removed', async () => {
            const container = createTabList(1);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Focus and remove the only item.
            (container.querySelector('#tab-0') as HTMLElement).focus();
            container.querySelector('#tab-0')!.remove();
            await flushObservers();

            // Insert a new item.
            const newItem = document.createElement('button');
            newItem.setAttribute('role', 'tab');
            newItem.id = 'tab-fresh';
            newItem.setAttribute('tabindex', '-1');
            container.appendChild(newItem);
            await flushObservers();

            // Should become the tab stop.
            expect(newItem.getAttribute('tabindex')).toBe('0');
        });

        it('should only give tabindex="0" to the first of multiple simultaneously inserted items', async () => {
            const container = createContainer('<div role="tablist"></div>');
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            // Insert multiple items at once via innerHTML.
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `
                <button role="tab" id="tab-a" tabindex="-1">A</button>
                <button role="tab" id="tab-b" tabindex="-1">B</button>
            `;
            // Move children into container.
            while (wrapper.firstChild) {
                container.appendChild(wrapper.firstChild);
            }
            await flushObservers();

            // First inserted item should get tabindex="0", second should be "-1".
            expect(container.querySelector('#tab-a')!.getAttribute('tabindex')).toBe('0');
            expect(container.querySelector('#tab-b')!.getAttribute('tabindex')).toBe('-1');
        });
    });

    describe('attribute change normalization (MutationObserver)', () => {
        it('should set tabindex="-1" when an item becomes disabled', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );

            // Disable tab-1.
            container.querySelector('#tab-1')!.setAttribute('aria-disabled', 'true');
            await flushObservers();

            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
        });

        it('should move tabindex="0" to fallback when the active item becomes disabled (no focus)', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );
            expect(nav.activeItem?.id).toBe('tab-0');

            // Disable the active item (no focus in container).
            container.querySelector('#tab-0')!.setAttribute('aria-disabled', 'true');
            await flushObservers();

            // Active item forced to tabindex="-1".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            // A fallback should have tabindex="0".
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            // The fallback item has tabindex="0", so getActiveItem reads it from DOM.
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-1');
        });

        it('should move focus to fallback when the active item becomes disabled (container has focus)', async () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );
            expect(nav.activeItem?.id).toBe('tab-0');

            // Focus the active item.
            (container.querySelector('#tab-0') as HTMLElement).focus();

            // Disable the active item.
            container.querySelector('#tab-0')!.setAttribute('aria-disabled', 'true');
            await flushObservers();

            // Active item forced to tabindex="-1".
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('-1');
            // Fallback should be activated and focused.
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('0');
            expect(document.activeElement?.id).toBe('tab-1');
        });

        it('should not react to attribute changes on non-item elements', async () => {
            const container = createContainer(`
                <div role="tablist">
                    <div id="wrapper">
                        <button role="tab" id="tab-0" tabindex="0">Tab 0</button>
                    </div>
                </div>
            `);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );

            // Change an attribute on the wrapper (not an item).
            container.querySelector('#wrapper')!.setAttribute('aria-disabled', 'true');
            await flushObservers();

            // Nothing should change.
            expect(nav.activeItem?.id).toBe('tab-0');
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
        });
    });

    describe('attribute change normalization (re-enable)', () => {
        it('should keep tabindex="-1" when a non-active disabled item is re-enabled', async () => {
            const container = createContainer(`
                <div role="group">
                    <button role="tab" id="tab-0" tabindex="0">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="-1" aria-disabled="true">Tab 1</button>
                    <button role="tab" id="tab-2" tabindex="-1">Tab 2</button>
                </div>
            `);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                {
                    container,
                    itemSelector: '[role="tab"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                ac.signal,
            );
            expect(nav.activeItem?.id).toBe('tab-0');

            // Re-enable tab-1.
            container.querySelector('#tab-1')!.removeAttribute('aria-disabled');
            await flushObservers();

            // tab-1 should remain tabindex="-1" — re-enabling does not make it a tab stop.
            expect(container.querySelector('#tab-1')!.getAttribute('tabindex')).toBe('-1');
            // tab-0 should still be the active tab stop.
            expect(container.querySelector('#tab-0')!.getAttribute('tabindex')).toBe('0');
            expect(nav.activeItem?.id).toBe('tab-0');
        });
    });

    describe('vertical keyboard navigation', () => {
        it('should navigate with ArrowDown/ArrowUp in vertical mode', () => {
            const container = createContainer(`
                <div role="listbox">
                    <div role="option" id="opt-0" tabindex="0">Option 0</div>
                    <div role="option" id="opt-1" tabindex="-1">Option 1</div>
                    <div role="option" id="opt-2" tabindex="-1">Option 2</div>
                </div>
            `);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                { container, itemSelector: '[role="option"]', direction: 'vertical' },
                ac.signal,
            );
            expect(nav.activeItem?.id).toBe('opt-0');

            // Focus the active item.
            (container.querySelector('#opt-0') as HTMLElement).focus();

            // ArrowDown should navigate to the next item.
            const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
            container.querySelector('#opt-0')!.dispatchEvent(downEvent);
            expect(nav.activeItem?.id).toBe('opt-1');

            // ArrowUp should navigate back.
            const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
            container.querySelector('#opt-1')!.dispatchEvent(upEvent);
            expect(nav.activeItem?.id).toBe('opt-0');
        });

        it('should ignore ArrowLeft/ArrowRight in vertical mode', () => {
            const container = createContainer(`
                <div role="listbox">
                    <div role="option" id="opt-0" tabindex="0">Option 0</div>
                    <div role="option" id="opt-1" tabindex="-1">Option 1</div>
                </div>
            `);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                { container, itemSelector: '[role="option"]', direction: 'vertical' },
                ac.signal,
            );

            // Focus the active item.
            (container.querySelector('#opt-0') as HTMLElement).focus();

            // ArrowRight should be a no-op.
            const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            container.querySelector('#opt-0')!.dispatchEvent(rightEvent);
            expect(nav.activeItem?.id).toBe('opt-0');

            // ArrowLeft should be a no-op.
            const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
            container.querySelector('#opt-0')!.dispatchEvent(leftEvent);
            expect(nav.activeItem?.id).toBe('opt-0');
        });
    });

    describe('keyboard navigation after removal recovery', () => {
        it('should allow arrow navigation after silent recovery (no focus)', async () => {
            const container = createTabList(4);
            const ac = new AbortController();
            const nav = setupRovingTabIndex(
                { container, itemSelector: '[role="tab"]', direction: 'horizontal' },
                ac.signal,
            );

            // Navigate to tab-1.
            nav.goToItem(container.querySelector('#tab-1') as HTMLElement);

            // Focus outside the container.
            const external = document.createElement('button');
            document.body.appendChild(external);
            external.focus();

            // Remove tab-1.
            container.querySelector('#tab-1')!.remove();
            await flushObservers();

            // tab-2 now has tabindex="0" — getActiveItem reads it from DOM.
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-2');
            expect(container.querySelector('#tab-2')!.getAttribute('tabindex')).toBe('0');

            // Simulate Tab-back-in: user focuses tab-2 and presses ArrowRight.
            const tab2 = container.querySelector('#tab-2') as HTMLElement;
            tab2.focus();
            const keydown = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            tab2.dispatchEvent(keydown);

            // Navigation should move from tab-2 to tab-3.
            expect(nav.activeItem?.id).toBe('tab-3');
        });
    });
});
