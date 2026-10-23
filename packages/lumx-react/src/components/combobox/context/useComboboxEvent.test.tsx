import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Combobox } from '..';

/** Consumer of the public hook: reads a combobox event (`open`) and a list event (`optionsChange`). */
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
    it('should read the open state and the list events of the combobox', async () => {
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
