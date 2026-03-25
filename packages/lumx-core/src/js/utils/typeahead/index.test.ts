// @vitest-environment jsdom
import { vi } from 'vitest';

import { createTypeahead } from '.';
import { createSelectorTreeWalker } from '../browser/createSelectorTreeWalker';

/** Helper: create a container with child elements labeled by text. */
function createContainer(labels: string[]): { container: HTMLElement; items: HTMLElement[] } {
    const container = document.createElement('div');
    const items = labels.map((label) => {
        const el = document.createElement('div');
        el.textContent = label;
        container.appendChild(el);
        return el;
    });
    return { container, items };
}

/** Helper: create a getWalker callback for a container selecting all child divs. */
function walkerFor(container: HTMLElement): () => TreeWalker {
    return () => createSelectorTreeWalker(container, 'div');
}

describe(createTypeahead, () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('basic matching', () => {
        it('should match an item by its first character', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Cherry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('b', null)).toBe(items[1]);
        });

        it('should match case-insensitively', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Cherry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('B', null)).toBe(items[1]);
        });

        it('should return null when no item matches', () => {
            const { container } = createContainer(['Apple', 'Banana', 'Cherry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('z', null)).toBeNull();
        });

        it('should return null when container is empty', () => {
            const { container } = createContainer([]);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('a', null)).toBeNull();
        });

        it('should return null when walker is null', () => {
            const ac = new AbortController();
            const typeahead = createTypeahead(
                () => null,
                (item) => item.textContent!,
                ac.signal,
            );

            expect(typeahead.handle('a', null)).toBeNull();
        });

        it('should match the first item when multiple items start with the same letter', () => {
            const { container, items } = createContainer(['Apple', 'Avocado', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('a', null)).toBe(items[0]);
        });
    });

    describe('multi-character prefix matching', () => {
        it('should accumulate characters to narrow the match', () => {
            const { container, items } = createContainer(['Apple', 'Application', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // 'a' matches first 'a' item
            expect(typeahead.handle('a', null)).toBe(items[0]);
            // 'ap' still matches both, returns first
            expect(typeahead.handle('p', items[0])).toBe(items[0]);
            // 'app' still matches both
            expect(typeahead.handle('p', items[0])).toBe(items[0]);
            // 'appl' still matches both
            expect(typeahead.handle('l', items[0])).toBe(items[0]);
            // 'appli' only matches 'Application'
            expect(typeahead.handle('i', items[0])).toBe(items[1]);
        });

        it('should match from current position for multi-char search', () => {
            const { container, items } = createContainer(['Banana', 'Bat', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // 'b' matches first 'b' item
            expect(typeahead.handle('b', null)).toBe(items[0]);
            // 'ba' matches 'Banana' (multi-char, starts from current item's index)
            expect(typeahead.handle('a', items[0])).toBe(items[0]);
        });
    });

    describe('single-character cycling', () => {
        it('should cycle through items starting with the same letter', () => {
            const { container, items } = createContainer(['Apple', 'Avocado', 'Apricot', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // First 'a' -> Apple
            expect(typeahead.handle('a', null)).toBe(items[0]);
            // Second 'a' (all same char) -> cycle from Apple -> Avocado
            expect(typeahead.handle('a', items[0])).toBe(items[1]);
            // Third 'a' -> cycle from Avocado -> Apricot
            expect(typeahead.handle('a', items[1])).toBe(items[2]);
            // Fourth 'a' -> wraps around, skips Banana, goes to Apple
            expect(typeahead.handle('a', items[2])).toBe(items[0]);
        });

        it('should wrap around when cycling past the last matching item', () => {
            const { container, items } = createContainer(['Banana', 'Cherry', 'Blueberry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // 'b' -> Banana
            expect(typeahead.handle('b', null)).toBe(items[0]);
            // 'b' again -> cycle from Banana -> Blueberry
            expect(typeahead.handle('b', items[0])).toBe(items[2]);
            // 'b' again -> cycle from Blueberry -> wraps to Banana
            expect(typeahead.handle('b', items[2])).toBe(items[0]);
        });
    });

    describe('search timeout', () => {
        it('should reset the accumulated search string after 500ms', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Type 'b' -> matches Banana
            expect(typeahead.handle('b', null)).toBe(items[1]);

            // Wait 500ms for timeout to reset
            vi.advanceTimersByTime(500);

            // Type 'b' again after reset -> single-char search cycles from next after currentItem
            // Since currentItem is Banana (index 1), it starts at index 2 -> Berry
            expect(typeahead.handle('b', items[1])).toBe(items[2]);

            // Wait 500ms for timeout to reset again
            vi.advanceTimersByTime(500);

            // Type 'b' with no currentItem -> starts fresh from beginning -> Banana
            expect(typeahead.handle('b', null)).toBe(items[1]);
        });

        it('should accumulate characters when typed within 500ms', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Type 'b' -> matches Banana
            expect(typeahead.handle('b', null)).toBe(items[1]);

            // Type 'e' within 500ms -> search is 'be', matches Berry
            vi.advanceTimersByTime(200);
            expect(typeahead.handle('e', items[1])).toBe(items[2]);
        });

        it('should reset the timeout on each new character', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            typeahead.handle('b', null);

            // Advance 400ms (less than 500ms)
            vi.advanceTimersByTime(400);
            // Type another character before timeout
            typeahead.handle('e', items[1]);

            // Advance another 400ms (800ms total, but only 400ms since last char)
            vi.advanceTimersByTime(400);
            // 'ber' should still accumulate correctly since timeout was reset
            expect(typeahead.handle('r', items[2])).toBe(items[2]);
        });
    });

    describe('reset', () => {
        it('should clear the search string when reset is called', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Type 'b' -> matches Banana
            typeahead.handle('b', null);
            // Type 'a' -> accumulated 'ba' -> matches Banana (multi-char)
            expect(typeahead.handle('a', items[1])).toBe(items[1]);

            // Manual reset
            typeahead.reset();

            // Type 'b' again with no currentItem -> starts fresh from beginning -> Banana
            expect(typeahead.handle('b', null)).toBe(items[1]);
            // Type 'e' -> accumulated 'be' -> matches Berry (multi-char prefix)
            expect(typeahead.handle('e', items[1])).toBe(items[2]);
        });

        it('should clear pending timeout when reset is called', () => {
            const { container, items } = createContainer(['Apple', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            typeahead.handle('a', null);
            typeahead.reset();

            // Advancing time should not cause issues (timeout was cleared)
            vi.advanceTimersByTime(1000);

            // Should start fresh
            expect(typeahead.handle('b', null)).toBe(items[1]);
        });
    });

    describe('abort signal', () => {
        it('should reset when the abort signal fires', () => {
            const { container, items } = createContainer(['Apple', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Type 'a' -> matches Apple
            typeahead.handle('a', null);

            // Abort
            ac.abort();

            // After abort, search string should be reset
            // Type 'a' again -> starts fresh
            expect(typeahead.handle('a', null)).toBe(items[0]);
        });
    });

    describe('currentItem handling', () => {
        it('should start from beginning when currentItem is null', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Cherry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('a', null)).toBe(items[0]);
        });

        it('should start from beginning when currentItem is not found in items', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Cherry']);
            const unknownItem = document.createElement('div');
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('a', unknownItem)).toBe(items[0]);
        });

        it('should search from current item position for multi-char search', () => {
            const { container, items } = createContainer(['Banana', 'Cherry', 'Berry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Type 'be' -> multi-char search starts from currentItem (Cherry at index 1)
            typeahead.handle('b', null);
            // After 'b', current is Banana. Type 'e' -> 'be', multi-char prefix,
            // search starts from Banana's index -> matches Banana itself? No, 'be' doesn't start 'banana'.
            // It wraps around and finds Berry.
            expect(typeahead.handle('e', items[0])).toBe(items[2]);
        });
    });

    describe('wrapping behavior', () => {
        it('should wrap around to find items before the current position', () => {
            const { container, items } = createContainer(['Apple', 'Banana', 'Cherry']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // Start from Cherry (last item), type 'a' -> should wrap and find Apple
            expect(typeahead.handle('a', items[2])).toBe(items[0]);
        });

        it('should cycle correctly when single-char cycling wraps', () => {
            const { container, items } = createContainer(['Cherry', 'Cat', 'Dog']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            // 'c' -> Cherry
            expect(typeahead.handle('c', null)).toBe(items[0]);
            // 'c' -> cycle from Cherry -> Cat
            expect(typeahead.handle('c', items[0])).toBe(items[1]);
            // 'c' -> cycle from Cat -> wraps -> Cherry
            expect(typeahead.handle('c', items[1])).toBe(items[0]);
        });
    });

    describe('dynamic items', () => {
        it('should use the current items from getWalker on each call', () => {
            const { container, items } = createContainer(['Apple', 'Banana']);
            const ac = new AbortController();
            const typeahead = createTypeahead(walkerFor(container), (item) => item.textContent!, ac.signal);

            expect(typeahead.handle('a', null)).toBe(items[0]);

            // Change items dynamically by replacing container children
            vi.advanceTimersByTime(500); // reset search
            container.innerHTML = '';
            const newItems = ['Avocado', 'Blueberry'].map((label) => {
                const el = document.createElement('div');
                el.textContent = label;
                container.appendChild(el);
                return el;
            });

            expect(typeahead.handle('a', null)).toBe(newItems[0]);
        });
    });
});
