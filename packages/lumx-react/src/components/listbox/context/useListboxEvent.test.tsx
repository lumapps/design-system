import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';

import { ListboxContext, useListboxContext } from './ListboxContext';
import { Combobox } from '../../combobox';
import { useListboxEvent } from './useListboxEvent';

/**
 * Reads the live option count through the hook and renders the options as its children —
 * mirroring the list (the consumer is an ancestor of the options, so React fires its
 * useSyncExternalStore check after the children register, bottom-up).
 */
function OptionList({ children }: { children: React.ReactNode }) {
    const { list } = useListboxContext();
    const state = useListboxEvent(list, 'optionsChange', undefined);
    return (
        <ul role="listbox" data-testid="list" data-count={state?.optionsLength ?? 0}>
            {children}
        </ul>
    );
}

/** Registers a real option element against the handle on mount (like Combobox.Option). */
function Option({ list, label }: { list: ListboxHandle; label: string }) {
    const ref = React.useRef<HTMLLIElement>(null);
    React.useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        return list.registerOption(el, () => undefined);
    }, [list]);
    return (
        <li ref={ref} role="option" aria-selected={false}>
            {label}
        </li>
    );
}

function Harness({ list, count }: { list: ListboxHandle; count: number }) {
    const ctx = React.useMemo(() => ({ list, listboxId: 'lb', type: 'listbox' as const }), [list]);
    return (
        <ListboxContext.Provider value={ctx}>
            <OptionList>
                {Array.from({ length: count }, (_, i) => (
                    <Option key={i} list={list} label={`opt-${i}`} />
                ))}
            </OptionList>
        </ListboxContext.Provider>
    );
}

describe('useListboxEvent', () => {
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

        const list = setupListbox();
        render(<Harness list={list} count={200} />);

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

/** Consumer of the public hook: reads a combobox event and a listbox event. */
function ComboboxEvents() {
    const isOpen = Combobox.useComboboxEvent('open', false);
    const options = Combobox.useComboboxEvent('optionsChange', undefined);
    return (
        <output data-testid="events" data-open={isOpen} data-count={options?.optionsLength ?? 0}>
            events
        </output>
    );
}

describe('useComboboxEvent', () => {
    it('should read the open state and the listbox events of the combobox', async () => {
        render(
            <Combobox.Provider>
                <Combobox.Button label="Fruits" />
                <ComboboxEvents />
                <Combobox.Popover>
                    <Combobox.List aria-label="Fruits">
                        {['Apple', 'Banana', 'Cherry'].map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                </Combobox.Popover>
            </Combobox.Provider>,
        );
        const events = screen.getByTestId('events');
        expect(events).toHaveAttribute('data-open', 'false');
        expect(events).toHaveAttribute('data-count', '0');

        await userEvent.click(screen.getByRole('combobox'));
        await waitFor(() => expect(events).toHaveAttribute('data-open', 'true'));
        await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
    });
});
