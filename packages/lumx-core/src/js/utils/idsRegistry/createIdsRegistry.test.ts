import { describe, expect, it, vi } from 'vitest';

import { createIdsRegistry } from './createIdsRegistry';

describe('createIdsRegistry', () => {
    it('should return undefined for an unregistered name', () => {
        const registry = createIdsRegistry();
        expect(registry.getId('dialog-label')).toBeUndefined();
    });

    it('should store and read an id by name', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        expect(registry.getId('dialog-label')).toBe('heading-1');
    });

    it('should clear an id when set to undefined', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-1', undefined);
        expect(registry.getId('dialog-label')).toBeUndefined();
    });

    it('should keep ids under different names independent', () => {
        const registry = createIdsRegistry();
        registry.setId('a', 'token-1', 'id-a');
        registry.setId('b', 'token-2', 'id-b');
        expect(registry.getId('a')).toBe('id-a');
        expect(registry.getId('b')).toBe('id-b');
    });

    it('should notify a subscriber when its name changes', () => {
        const registry = createIdsRegistry();
        const listener = vi.fn();
        registry.subscribe('dialog-label', listener);

        registry.setId('dialog-label', 'token-1', 'heading-1');

        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not notify when the value is unchanged', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        const listener = vi.fn();
        registry.subscribe('dialog-label', listener);

        registry.setId('dialog-label', 'token-1', 'heading-1');

        expect(listener).not.toHaveBeenCalled();
    });

    it('should only notify listeners of the changed name', () => {
        const registry = createIdsRegistry();
        const listenerA = vi.fn();
        const listenerB = vi.fn();
        registry.subscribe('a', listenerA);
        registry.subscribe('b', listenerB);

        registry.setId('a', 'token-1', 'id-a');

        expect(listenerA).toHaveBeenCalledTimes(1);
        expect(listenerB).not.toHaveBeenCalled();
    });

    it('should stop notifying after unsubscribe', () => {
        const registry = createIdsRegistry();
        const listener = vi.fn();
        const unsubscribe = registry.subscribe('dialog-label', listener);

        unsubscribe();
        registry.setId('dialog-label', 'token-1', 'heading-1');

        expect(listener).not.toHaveBeenCalled();
    });

    it('should support a listener unsubscribing during notification', () => {
        const registry = createIdsRegistry();
        const calls: string[] = [];
        const unsubscribe = registry.subscribe('dialog-label', () => {
            calls.push('first');
            unsubscribe();
        });
        registry.subscribe('dialog-label', () => calls.push('second'));

        expect(() => registry.setId('dialog-label', 'token-1', 'heading-1')).not.toThrow();
        expect(calls).toEqual(['first', 'second']);
    });

    it('should have the most recently registered token win when two tokens register under the same name', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-2', 'heading-2');

        expect(registry.getId('dialog-label')).toBe('heading-2');
    });

    it('should fall back to an older still-registered token when the winning token clears itself', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-2', 'heading-2');

        registry.setId('dialog-label', 'token-2', undefined);

        expect(registry.getId('dialog-label')).toBe('heading-1');
    });

    it('should notify listeners when clearing the winning token falls back to another one', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-2', 'heading-2');
        const listener = vi.fn();
        registry.subscribe('dialog-label', listener);

        registry.setId('dialog-label', 'token-2', undefined);

        expect(listener).toHaveBeenCalledTimes(1);
        expect(registry.getId('dialog-label')).toBe('heading-1');
    });

    it('should not change the winner when a non-winning token clears itself', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-2', 'heading-2');
        const listener = vi.fn();
        registry.subscribe('dialog-label', listener);

        registry.setId('dialog-label', 'token-1', undefined);

        expect(listener).not.toHaveBeenCalled();
        expect(registry.getId('dialog-label')).toBe('heading-2');
    });

    it('should move a re-registering token back to the top of the stack', () => {
        const registry = createIdsRegistry();
        registry.setId('dialog-label', 'token-1', 'heading-1');
        registry.setId('dialog-label', 'token-2', 'heading-2');

        // token-1 updates its id: it should become the winner again (most recently registered).
        registry.setId('dialog-label', 'token-1', 'heading-1-updated');

        expect(registry.getId('dialog-label')).toBe('heading-1-updated');
    });
});
