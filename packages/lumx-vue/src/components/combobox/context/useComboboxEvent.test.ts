import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h } from 'vue';

import { Combobox } from '..';
import { useComboboxEvent } from './useComboboxEvent';

/** Consumer of the public composable: reads a combobox event (`open`) and a list event (`optionsChange`). */
const ComboboxEvents = defineComponent(() => {
    const isOpen = useComboboxEvent('open', false);
    const options = useComboboxEvent('optionsChange', undefined);
    return () =>
        h(
            'output',
            {
                'data-testid': 'events',
                'data-open': String(isOpen.value),
                'data-count': options.value?.optionsLength ?? 0,
            },
            'events',
        );
});

describe('useComboboxEvent', () => {
    it('should read the open state and the list events of the combobox', async () => {
        render(
            defineComponent(
                () => () =>
                    h(Combobox.Provider, null, {
                        default: () => [
                            h(Combobox.Button, { label: 'Fruits' }),
                            h(ComboboxEvents),
                            h(Combobox.Popover, null, {
                                default: () =>
                                    h(
                                        Combobox.List,
                                        { 'aria-label': 'Fruits' },
                                        {
                                            default: () =>
                                                ['Apple', 'Banana', 'Cherry'].map((fruit) =>
                                                    h(Combobox.Option, { key: fruit, value: fruit }, () => fruit),
                                                ),
                                        },
                                    ),
                            }),
                        ],
                    }),
            ),
        );
        const events = screen.getByTestId('events');
        expect(events).toHaveAttribute('data-open', 'false');
        expect(events).toHaveAttribute('data-count', '0');

        await userEvent.click(screen.getByRole('combobox'));
        await waitFor(() => expect(events).toHaveAttribute('data-open', 'true'));
        await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
    });
});
