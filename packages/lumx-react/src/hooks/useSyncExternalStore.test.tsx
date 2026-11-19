import React, { useEffect } from 'react';
import { act, render, screen } from '@testing-library/react';

import { useSyncExternalStore, useSyncExternalStoreFallback } from './useSyncExternalStore';

function createStore(initialValue: number) {
    let value = initialValue;
    const listeners = new Set<() => void>();
    return {
        getSnapshot: () => value,
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        set(newValue: number) {
            value = newValue;
            listeners.forEach((listener) => listener());
        },
        listenerCount: () => listeners.size,
    };
}

describe(useSyncExternalStore, () => {
    it('should use the React implementation when available', () => {
        expect(useSyncExternalStore).toBe(React.useSyncExternalStore);
    });
});

describe(useSyncExternalStoreFallback, () => {
    it('should render the current value and update on store change', () => {
        const store = createStore(1);
        const Value = () => <span>{useSyncExternalStoreFallback(store.subscribe, store.getSnapshot)}</span>;
        render(<Value />);
        expect(screen.getByText('1')).toBeInTheDocument();

        act(() => store.set(2));
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should get the store change made before the subscription', () => {
        const store = createStore(1);
        const Value = () => <span>{useSyncExternalStoreFallback(store.subscribe, store.getSnapshot)}</span>;
        const Writer = () => {
            useEffect(() => store.set(2), []);
            return null;
        };
        render(
            <>
                <Writer />
                <Value />
            </>,
        );
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should unsubscribe on unmount', () => {
        const store = createStore(1);
        const Value = () => <span>{useSyncExternalStoreFallback(store.subscribe, store.getSnapshot)}</span>;
        const { unmount } = render(<Value />);
        expect(store.listenerCount()).toBe(1);

        unmount();
        expect(store.listenerCount()).toBe(0);
    });
});
