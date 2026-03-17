// @vitest-environment jsdom
import { setupRovingTabIndex } from './setupRovingTabIndex';

function createContainer(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    document.body.appendChild(div);
    return div.firstElementChild as HTMLElement;
}

function createTabList(count: number, { disabledIndices = [] as number[], activeIndex = 0 } = {}): HTMLElement {
    const tabs = Array.from({ length: count }, (_, i) => {
        const disabled = disabledIndices.includes(i) ? ' aria-disabled="true"' : '';
        const tabindex = ` tabindex="${i === activeIndex ? '0' : '-1'}"`;
        return `<button role="tab" id="tab-${i}"${disabled}${tabindex}>Tab ${i}</button>`;
    }).join('');
    return createContainer(`<div role="tablist">${tabs}</div>`);
}

function pressKey(target: HTMLElement, key: string) {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('setupRovingTabIndex', () => {
    describe('keyboard navigation (horizontal)', () => {
        it('should move focus with ArrowRight', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');

            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            expect(document.activeElement).toBe(tab1);
            expect(tab0.getAttribute('tabindex')).toBe('-1');
            expect(tab1.getAttribute('tabindex')).toBe('0');
        });

        it('should move focus with ArrowLeft', () => {
            const container = createTabList(3, { activeIndex: 2 });
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab2 = container.querySelector('#tab-2') as HTMLElement;
            tab2.focus();
            pressKey(tab2, 'ArrowLeft');

            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            expect(document.activeElement).toBe(tab1);
        });

        it('should ignore ArrowUp/ArrowDown in horizontal mode', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowDown');
            expect(document.activeElement).toBe(tab0);
        });

        it('should wrap from last to first (default wrap=true)', () => {
            const container = createTabList(3, { activeIndex: 2 });
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab2 = container.querySelector('#tab-2') as HTMLElement;
            tab2.focus();
            pressKey(tab2, 'ArrowRight');

            expect(document.activeElement).toBe(container.querySelector('#tab-0'));
        });

        it('should wrap from first to last', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowLeft');

            expect(document.activeElement).toBe(container.querySelector('#tab-2'));
        });
    });

    describe('keyboard navigation (vertical)', () => {
        it('should navigate with ArrowDown/ArrowUp', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]', direction: 'vertical' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowDown');
            expect(document.activeElement).toBe(container.querySelector('#tab-1'));

            pressKey(container.querySelector('#tab-1') as HTMLElement, 'ArrowUp');
            expect(document.activeElement).toBe(container.querySelector('#tab-0'));
        });

        it('should ignore ArrowLeft/ArrowRight in vertical mode', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]', direction: 'vertical' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');
            expect(document.activeElement).toBe(tab0);
        });
    });

    describe('Home / End keys', () => {
        it('Home should navigate to the first item', () => {
            const container = createTabList(5, { activeIndex: 3 });
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab3 = container.querySelector('#tab-3') as HTMLElement;
            tab3.focus();
            pressKey(tab3, 'Home');

            expect(document.activeElement).toBe(container.querySelector('#tab-0'));
        });

        it('End should navigate to the last item', () => {
            const container = createTabList(5);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'End');

            expect(document.activeElement).toBe(container.querySelector('#tab-4'));
        });
    });

    describe('disabled item skipping', () => {
        it('should skip disabled items when navigating', () => {
            const container = createTabList(4, { disabledIndices: [1, 2] });
            const ac = new AbortController();
            setupRovingTabIndex(
                { container, itemSelector: '[role="tab"]', itemDisabledSelector: '[aria-disabled="true"]' },
                ac.signal,
            );

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');

            expect(document.activeElement).toBe(container.querySelector('#tab-3'));
        });

        it('Home/End should skip disabled items', () => {
            const container = createTabList(5, { disabledIndices: [0, 4] });
            const ac = new AbortController();
            setupRovingTabIndex(
                { container, itemSelector: '[role="tab"]', itemDisabledSelector: '[aria-disabled="true"]' },
                ac.signal,
            );

            const tab2 = container.querySelector('#tab-2') as HTMLElement;
            tab2.focus();

            pressKey(tab2, 'Home');
            expect(document.activeElement).toBe(container.querySelector('#tab-1'));

            pressKey(container.querySelector('#tab-1') as HTMLElement, 'End');
            expect(document.activeElement).toBe(container.querySelector('#tab-3'));
        });
    });

    describe('onItemFocused callback', () => {
        it('should call onItemFocused when an item receives focus via keyboard', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const onItemFocused = vi.fn();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]', onItemFocused }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');

            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            expect(onItemFocused).toHaveBeenCalledWith(tab1);
        });
    });

    describe('DOM initialization', () => {
        it('should init active item from the element with tabindex="0" in the DOM', () => {
            const container = createTabList(3, { activeIndex: 1 });
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-1');
        });

        it('should have no active item when no element has tabindex="0"', () => {
            // All items have tabindex="-1"
            const container = createContainer(
                `<div role="tablist">
                    <button role="tab" id="tab-0" tabindex="-1">Tab 0</button>
                    <button role="tab" id="tab-1" tabindex="-1">Tab 1</button>
                </div>`,
            );
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(nav.hasActiveItem).toBe(false);
        });

        it('should not call focus() when initializing from DOM', () => {
            const container = createTabList(3, { activeIndex: 1 });
            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            const focusSpy = vi.spyOn(tab1, 'focus');

            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(focusSpy).not.toHaveBeenCalled();
        });
    });

    describe('returned controller', () => {
        it('should return a FocusNavigationController', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            expect(nav.type).toBe('list');
            expect(nav.hasNavigableItems).toBe(true);
            // tab-0 has tabindex="0" in the DOM, so it is initialized as the active item
            expect(nav.hasActiveItem).toBe(true);
            expect(nav.activeItem?.id).toBe('tab-0');

            // Navigate away then back to verify focus() is called
            nav.goToOffset(1);
            expect(nav.activeItem?.id).toBe('tab-1');
            expect(document.activeElement).toBe(container.querySelector('#tab-1'));

            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('tab-0');
            expect(document.activeElement).toBe(container.querySelector('#tab-0'));
        });
    });

    describe('stale active item recovery', () => {
        it('should recover navigation when the active item is removed from the DOM', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');
            expect(document.activeElement).toBe(tab1);

            // Remove tab1 (the currently active item) from the DOM.
            tab1.remove();

            // Focus tab2 and try to navigate — should recover from tab2.
            const tab2 = container.querySelector('#tab-2') as HTMLElement;
            tab2.focus();
            pressKey(tab2, 'ArrowLeft');

            // Should navigate to tab0 (the only remaining neighbor).
            expect(document.activeElement).toBe(tab0);
        });
    });

    describe('cleanup on abort', () => {
        it('should remove keydown listener and clean up navigation state on abort', () => {
            const container = createTabList(3);
            const ac = new AbortController();
            const nav = setupRovingTabIndex({ container, itemSelector: '[role="tab"]' }, ac.signal);

            const tab0 = container.querySelector('#tab-0') as HTMLElement;
            tab0.focus();
            pressKey(tab0, 'ArrowRight');
            expect(document.activeElement).toBe(container.querySelector('#tab-1'));

            ac.abort();
            expect(nav.activeItem).toBeNull();

            // Keydown should no longer navigate after abort
            const tab1 = container.querySelector('#tab-1') as HTMLElement;
            tab1.focus();
            pressKey(tab1, 'ArrowRight');
            // Focus should not have moved (listener removed)
            expect(document.activeElement).toBe(tab1);
        });
    });
});
