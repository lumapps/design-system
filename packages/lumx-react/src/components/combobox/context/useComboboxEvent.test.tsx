import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { setupCombobox } from '@lumx/core/js/components/Combobox/setupCombobox';
import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

import { ComboboxContext } from './ComboboxContext';
import { useComboboxEvent } from './useComboboxEvent';

/**
 * Reads the live option count through the hook and renders the options as its children —
 * mirroring ComboboxList (the consumer is an ancestor of the options, so React fires its
 * useSyncExternalStore check after the children register, bottom-up).
 */
function OptionList({ children }: { children: React.ReactNode }) {
    const state = useComboboxEvent('optionsChange', undefined);
    return (
        <ul role="listbox" data-testid="list" data-count={state?.optionsLength ?? 0}>
            {children}
        </ul>
    );
}

/** Registers a real option element against the handle on mount (like Combobox.Option). */
function Option({ handle, label }: { handle: ComboboxHandle; label: string }) {
    const ref = React.useRef<HTMLLIElement>(null);
    React.useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        return handle.registerOption(el, () => undefined);
    }, [handle]);
    return (
        <li ref={ref} role="option" aria-selected={false}>
            {label}
        </li>
    );
}

function Harness({ handle, count }: { handle: ComboboxHandle; count: number }) {
    const ctx = React.useMemo(
        () => ({ handle, setHandle: () => undefined, listboxId: 'lb', anchorRef: { current: null } }),
        [handle],
    );
    return (
        <ComboboxContext.Provider value={ctx}>
            <OptionList>
                {Array.from({ length: count }, (_, i) => (
                    <Option key={i} handle={handle} label={`opt-${i}`} />
                ))}
            </OptionList>
        </ComboboxContext.Provider>
    );
}

describe('useComboboxEvent', () => {
    it('reads the optionsChange snapshot during commit without an un-acted update', async () => {
        // The handle dispatches `optionsChange` synchronously as options register. React, via
        // useSyncExternalStore reading `getSnapshot`, must reflect the final count during its own
        // commit — including options registered by child effects before this consumer subscribed —
        // without any state update landing outside `act`.
        const actWarnings: string[] = [];
        const spy = vi.spyOn(console, 'error').mockImplementation((msg?: any) => {
            const s = String(msg);
            if (s.includes('not wrapped in act') || s.includes('not configured to support act')) {
                actWarnings.push(s);
            }
        });

        const handle = setupCombobox({});
        render(<Harness handle={handle} count={200} />);

        // Snapshot picked up during the initial commit (in act), not via the microtask push.
        expect(screen.getByTestId('list').getAttribute('data-count')).toBe('200');

        // Flushing the coalesced microtask push outside act must not schedule an un-acted update.
        await Promise.resolve();
        await Promise.resolve();

        expect(screen.getByTestId('list').getAttribute('data-count')).toBe('200');
        spy.mockRestore();
        expect(actWarnings).toEqual([]);
    });
});
