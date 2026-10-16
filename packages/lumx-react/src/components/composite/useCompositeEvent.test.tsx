import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';

import { CompositeContext, useCompositeContext } from './CompositeContext';
import { Combobox } from '../combobox';
import { useCompositeEvent } from './useCompositeEvent';

/**
 * Reads the live option count through the hook and renders the options as its children —
 * mirroring the list (the consumer is an ancestor of the options, so React fires its
 * useSyncExternalStore check after the children register, bottom-up).
 */
function OptionList({ children }: { children: React.ReactNode }) {
    const { handle } = useCompositeContext();
    const state = useCompositeEvent(handle, 'optionsChange', undefined);
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
    const ctx = React.useMemo(() => ({ handle: list, id: 'lb', type: 'listbox' as const }), [list]);
    return (
        <CompositeContext.Provider value={ctx}>
            <OptionList>
                {Array.from({ length: count }, (_, i) => (
                    <Option key={i} list={list} label={`opt-${i}`} />
                ))}
            </OptionList>
        </CompositeContext.Provider>
    );
}

describe('useCompositeEvent', () => {
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

/** Combobox whose list remounts (new list handle registered on the combobox) when `listKey` changes. */
function SwappableCombobox({
    listKey,
    fruits,
    onOpen,
    hasList = true,
}: {
    listKey: string;
    fruits: string[];
    onOpen: (isOpen: boolean) => void;
    hasList?: boolean;
}) {
    return (
        <Combobox.Provider onOpen={onOpen}>
            <Combobox.Button label="Fruits" />
            <ComboboxEvents />
            <Combobox.Popover>
                {hasList && (
                    <Combobox.List key={listKey} aria-label="Fruits">
                        {fruits.map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.List>
                )}
                <Combobox.State nbOptionMessage={(count: number) => `${count} options`} />
            </Combobox.Popover>
        </Combobox.Provider>
    );
}

describe('registered list change', () => {
    it('should re-subscribe the combobox events and the state to the new list', async () => {
        const onOpen = vi.fn();
        const { rerender } = render(
            <SwappableCombobox listKey="first" fruits={['Apple', 'Banana', 'Cherry']} onOpen={onOpen} />,
        );
        const events = screen.getByTestId('events');

        await userEvent.click(screen.getByRole('combobox'));
        await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
        expect(await screen.findByText('3 options')).toBeInTheDocument();
        expect(onOpen).toHaveBeenLastCalledWith(true);

        // Remount the list while open: a new list handle registers on the combobox.
        rerender(<SwappableCombobox listKey="second" fruits={['Date', 'Fig']} onOpen={onOpen} />);
        await waitFor(() => expect(events).toHaveAttribute('data-count', '2'));
        expect(await screen.findByText('2 options')).toBeInTheDocument();
        expect(screen.queryByText('3 options')).not.toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(2);
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');

        // The open state still reaches `onOpen` and the new list.
        onOpen.mockClear();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(events).toHaveAttribute('data-open', 'false'));
        expect(onOpen).toHaveBeenLastCalledWith(false);
        await userEvent.keyboard('{ArrowDown}');
        await waitFor(() => expect(events).toHaveAttribute('data-open', 'true'));
        expect(onOpen).toHaveBeenLastCalledWith(true);
        // The new list is linked to the trigger (the first option becomes active).
        await waitFor(() =>
            expect(screen.getByRole('combobox')).toHaveAttribute(
                'aria-activedescendant',
                screen.getByRole('option', { name: 'Date' }).id,
            ),
        );

        // Unmount the list while open: no list, nothing to show.
        rerender(<SwappableCombobox listKey="second" fruits={['Date', 'Fig']} onOpen={onOpen} hasList={false} />);
        await waitFor(() => expect(events).toHaveAttribute('data-count', '0'));
        expect(events).toHaveAttribute('data-open', 'true');
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
});
