// @vitest-environment jsdom
import { createListFocusNavigation } from './createListFocusNavigation';

import type { FocusNavigationCallbacks } from './types';

function createContainer(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    document.body.appendChild(div);
    return div.firstElementChild as HTMLElement;
}

function makeCallbacks() {
    const activated: HTMLElement[] = [];
    const deactivated: HTMLElement[] = [];
    const counter = { clearCount: 0 };
    const callbacks: FocusNavigationCallbacks = {
        onActivate: (item) => activated.push(item),
        onDeactivate: (item) => deactivated.push(item),
        onClear: () => {
            counter.clearCount += 1;
        },
    };
    return { callbacks, activated, deactivated, counter };
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('createListFocusNavigation', () => {
    function createList(count: number, filteredIndices: number[] = []): HTMLElement {
        const items = Array.from({ length: count }, (_, i) => {
            const filtered = filteredIndices.includes(i) ? ' data-filtered' : '';
            return `<div role="option" id="opt-${i}"${filtered}>Option ${i}</div>`;
        }).join('');
        return createContainer(`<div role="listbox">${items}</div>`);
    }

    describe('type property', () => {
        it('should report type as list', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]:not([data-filtered])' },
                callbacks,
                ac.signal,
            );
            expect(nav.type).toBe('list');
        });
    });

    describe('initial state', () => {
        it('should have no active item initially', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.activeItem).toBeNull();
            expect(nav.hasActiveItem).toBe(false);
        });

        it('should detect navigable items', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.hasNavigableItems).toBe(true);
        });

        it('should detect no navigable items in empty container', () => {
            const container = createContainer('<div role="listbox"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.hasNavigableItems).toBe(false);
        });
    });

    describe('goToFirst / goToLast', () => {
        it('should navigate to first item', () => {
            const container = createList(3);
            const { callbacks, activated } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToFirst()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-0');
            expect(activated).toHaveLength(1);
        });

        it('should navigate to last item', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToLast()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should return false on empty list', () => {
            const container = createContainer('<div></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToFirst()).toBe(false);
            expect(nav.goToLast()).toBe(false);
        });
    });

    describe('goToOffset', () => {
        it('should navigate forward by offset', () => {
            const container = createList(5);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goToOffset(2)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should navigate backward by offset', () => {
            const container = createList(5);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.goToOffset(-2)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should clamp at boundaries without wrap', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', wrap: false },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.goToOffset(5)).toBe(false);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should wrap with wrap enabled', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', wrap: true },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.goToOffset(1)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-0');
        });

        it('should start from first when no active item and offset is positive', () => {
            const container = createList(5);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToOffset(1)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-0');
        });

        it('should start from last when no active item and offset is negative', () => {
            const container = createList(5);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToOffset(-1)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-4');
        });
    });

    describe('goToItem', () => {
        it('should navigate to a specific item', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            const item = container.querySelector('#opt-1') as HTMLElement;
            expect(nav.goToItem(item)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('should return false for item not matching selector', () => {
            const container = createContainer('<div><span id="not-option">text</span></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            const item = container.querySelector('#not-option') as HTMLElement;
            expect(nav.goToItem(item)).toBe(false);
        });
    });

    describe('goToItemMatching', () => {
        it('should navigate to first item matching predicate', () => {
            const container = createContainer(`
                <div>
                    <div role="option" id="opt-0">A</div>
                    <div role="option" id="opt-1" aria-selected="true">B</div>
                    <div role="option" id="opt-2">C</div>
                </div>
            `);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToItemMatching((el) => el.getAttribute('aria-selected') === 'true')).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('should return false when no item matches', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToItemMatching(() => false)).toBe(false);
        });
    });

    describe('clear', () => {
        it('should clear active item and call onClear', () => {
            const container = createList(3);
            const { callbacks, deactivated, counter } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            nav.clear();
            expect(nav.activeItem).toBeNull();
            expect(nav.hasActiveItem).toBe(false);
            expect(deactivated).toHaveLength(1);
            expect(counter.clearCount).toBe(1);
        });
    });

    describe('directional navigation (vertical)', () => {
        it('goDown should navigate forward', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('goUp should navigate backward', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.goUp()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('goLeft/goRight should be no-ops in vertical mode', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goLeft()).toBe(false);
            expect(nav.goRight()).toBe(false);
        });
    });

    describe('directional navigation (horizontal)', () => {
        it('goRight should navigate forward', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'horizontal' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goRight()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('goLeft should navigate backward', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'horizontal' },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.goLeft()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('goUp/goDown should be no-ops in horizontal mode', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'horizontal' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goUp()).toBe(false);
            expect(nav.goDown()).toBe(false);
        });
    });

    describe('filtering', () => {
        it('should skip filtered items via selector', () => {
            const container = createList(5, [1, 3]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]:not([data-filtered])' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('opt-0');
            nav.goDown();
            expect(nav.activeItem?.id).toBe('opt-2');
            nav.goDown();
            expect(nav.activeItem?.id).toBe('opt-4');
        });
    });

    describe('itemDisabledSelector', () => {
        function createListWithDisabled(disabledIndices: number[]): HTMLElement {
            const items = Array.from({ length: 5 }, (_, i) => {
                const disabled = disabledIndices.includes(i) ? ' aria-disabled="true"' : '';
                return `<div role="option" id="opt-${i}"${disabled}>Option ${i}</div>`;
            }).join('');
            return createContainer(`<div role="listbox">${items}</div>`);
        }

        it('should skip disabled items when navigating forward', () => {
            const container = createListWithDisabled([1, 2]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('opt-0');
            nav.goDown();
            expect(nav.activeItem?.id).toBe('opt-3');
        });

        it('should skip disabled items when navigating backward', () => {
            const container = createListWithDisabled([2, 3]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.activeItem?.id).toBe('opt-4');
            nav.goUp();
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('goToFirst should skip leading disabled items', () => {
            const container = createListWithDisabled([0, 1]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            expect(nav.goToFirst()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('goToLast should skip trailing disabled items', () => {
            const container = createListWithDisabled([3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            expect(nav.goToLast()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('goToFirst should return false when all items are disabled', () => {
            const container = createListWithDisabled([0, 1, 2, 3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            expect(nav.goToFirst()).toBe(false);
        });

        it('hasNavigableItems should return false when all items are disabled', () => {
            const container = createListWithDisabled([0, 1, 2, 3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            expect(nav.hasNavigableItems).toBe(false);
        });

        it('should wrap around disabled items', () => {
            const container = createListWithDisabled([3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                    wrap: true,
                },
                callbacks,
                ac.signal,
            );
            nav.goToItem(container.querySelector('#opt-2') as HTMLElement);
            // Next enabled item wrapping around should be opt-0
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-0');
        });

        it('should return false when navigation cannot find an enabled item without wrap', () => {
            const container = createListWithDisabled([3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                    wrap: false,
                },
                callbacks,
                ac.signal,
            );
            nav.goToItem(container.querySelector('#opt-2') as HTMLElement);
            expect(nav.goDown()).toBe(false);
        });

        it('goToItem should still navigate to a disabled item directly', () => {
            const container = createListWithDisabled([1]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            const disabledItem = container.querySelector('#opt-1') as HTMLElement;
            expect(nav.goToItem(disabledItem)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-1');
        });

        it('should skip disabled items with goToOffset > 1', () => {
            const container = createListWithDisabled([1, 3]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            // offset 2 should skip opt-1 (disabled) and land on opt-2, then skip opt-3 (disabled) and land on opt-4
            expect(nav.goToOffset(2)).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-4');
        });

        it('should not land on a disabled item when offset exceeds available enabled items', () => {
            // [opt-0(enabled), opt-1(disabled), opt-2(disabled), opt-3(disabled), opt-4(enabled)]
            // From opt-0, offset=3 can only reach opt-4 (1 enabled step) — should stop there, not on a disabled item
            const container = createListWithDisabled([1, 2, 3]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goToOffset(3)).toBe(true);
            // Should land on opt-4 (the only reachable enabled item), not on a disabled one
            expect(nav.activeItem?.id).toBe('opt-4');
            expect(nav.activeItem?.getAttribute('aria-disabled')).not.toBe('true');
        });

        it('should return false when offset exceeds all enabled items without wrap', () => {
            // [opt-0(enabled), opt-1(disabled), opt-2(disabled), opt-3(disabled), opt-4(disabled)]
            // From opt-0, offset=2 — there is no second enabled item forward
            const container = createListWithDisabled([1, 2, 3, 4]);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.goToOffset(2)).toBe(false);
            // Active item must not have changed
            expect(nav.activeItem?.id).toBe('opt-0');
        });
    });

    describe('callback invocation order', () => {
        it('should call onDeactivate before onActivate when navigating', () => {
            const container = createList(3);
            const order: string[] = [];
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                {
                    onActivate: (item) => order.push(`activate:${item.id}`),
                    onDeactivate: (item) => order.push(`deactivate:${item.id}`),
                    onClear: () => order.push('clear'),
                },
                ac.signal,
            );
            nav.goToFirst();
            nav.goDown();
            expect(order).toEqual(['activate:opt-0', 'deactivate:opt-0', 'activate:opt-1']);
        });

        it('should call onDeactivate then onClear when clearing', () => {
            const container = createList(3);
            const order: string[] = [];
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                {
                    onActivate: (item) => order.push(`activate:${item.id}`),
                    onDeactivate: (item) => order.push(`deactivate:${item.id}`),
                    onClear: () => order.push('clear'),
                },
                ac.signal,
            );
            nav.goToFirst();
            nav.clear();
            expect(order).toEqual(['activate:opt-0', 'deactivate:opt-0', 'clear']);
        });
    });

    describe('cleanup on abort', () => {
        it('should deactivate and clear on abort signal', () => {
            const container = createList(3);
            const { callbacks, deactivated, counter } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            ac.abort();
            expect(nav.activeItem).toBeNull();
            expect(deactivated).toHaveLength(1);
            expect(counter.clearCount).toBe(1);
        });
    });

    describe('dynamic DOM changes', () => {
        it('should navigate to a dynamically added item', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToLast();
            expect(nav.activeItem?.id).toBe('opt-2');

            // Dynamically add a new item after the last one.
            const newItem = document.createElement('div');
            newItem.setAttribute('role', 'option');
            newItem.id = 'opt-3';
            newItem.textContent = 'Option 3';
            container.appendChild(newItem);

            // Navigation should pick up the new item.
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-3');
        });

        it('should skip a dynamically removed item', () => {
            const container = createList(5);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('opt-0');

            // Remove opt-1 from the DOM.
            container.querySelector('#opt-1')!.remove();

            // Navigating forward should skip opt-1 and go to opt-2.
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should handle navigating when the active item was removed', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]', direction: 'vertical' },
                callbacks,
                ac.signal,
            );
            nav.goToItem(container.querySelector('#opt-1') as HTMLElement);
            expect(nav.activeItem?.id).toBe('opt-1');

            // Remove the active item from the DOM.
            container.querySelector('#opt-1')!.remove();

            // The active item reference is stale but still held.
            // Navigating should fail gracefully (the stale element is no longer in the tree,
            // so the TreeWalker won't find siblings from it).
            // Clearing and re-navigating should work.
            nav.clear();
            expect(nav.goToFirst()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-0');
        });

        it('should reflect dynamically changed disabled state', () => {
            const container = createList(3);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                {
                    type: 'list',
                    container,
                    itemSelector: '[role="option"]',
                    itemDisabledSelector: '[aria-disabled="true"]',
                    direction: 'vertical',
                },
                callbacks,
                ac.signal,
            );
            nav.goToFirst();
            expect(nav.activeItem?.id).toBe('opt-0');

            // Dynamically disable opt-1.
            container.querySelector('#opt-1')!.setAttribute('aria-disabled', 'true');

            // Navigation should skip the newly disabled item.
            expect(nav.goDown()).toBe(true);
            expect(nav.activeItem?.id).toBe('opt-2');
        });

        it('should update hasNavigableItems after items are removed', () => {
            const container = createList(2);
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.hasNavigableItems).toBe(true);

            // Remove all items.
            container.querySelector('#opt-0')!.remove();
            container.querySelector('#opt-1')!.remove();

            expect(nav.hasNavigableItems).toBe(false);
        });

        it('should update goToFirst/goToLast after items are added', () => {
            const container = createContainer('<div role="listbox"></div>');
            const { callbacks } = makeCallbacks();
            const ac = new AbortController();
            const nav = createListFocusNavigation(
                { type: 'list', container, itemSelector: '[role="option"]' },
                callbacks,
                ac.signal,
            );
            expect(nav.goToFirst()).toBe(false);
            expect(nav.goToLast()).toBe(false);

            // Dynamically add items.
            const item0 = document.createElement('div');
            item0.setAttribute('role', 'option');
            item0.id = 'new-0';
            container.appendChild(item0);

            const item1 = document.createElement('div');
            item1.setAttribute('role', 'option');
            item1.id = 'new-1';
            container.appendChild(item1);

            expect(nav.goToFirst()).toBe(true);
            expect(nav.activeItem?.id).toBe('new-0');

            nav.clear();
            expect(nav.goToLast()).toBe(true);
            expect(nav.activeItem?.id).toBe('new-1');
        });
    });
});
