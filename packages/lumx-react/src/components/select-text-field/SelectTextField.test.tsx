import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import selectTextFieldTests, { TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField } from '.';
import { Combobox } from '../combobox';

/**
 * Render a SelectTextField template with controlled state management.
 * Manages a `value` state and wires it through the `onChange` prop.
 *
 * @param template    JSX render function receiving `{ value, onChange, ... }`.
 * @param initialArgs Initial props (value, spies, etc.).
 */
function renderWithState(template: (props: any) => React.JSX.Element, initialArgs: Record<string, any> = {}) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? undefined);
        const props = {
            ...initialArgs,
            value,
            onChange: (v: any) => {
                setValue(v);
                initialArgs.onChange?.(v);
            },
        };
        return template(props);
    };
    return render(<Wrapper />);
}

describe('<SelectTextField>', () => {
    selectTextFieldTests({
        components: { SelectTextField, Combobox },
        renderWithState,
    });

    describe('React', () => {
        it('should keep the selection and show its name on blur when onSearch is copied into searchInputValue', async () => {
            const FRUITS = [
                { id: 'apple', name: 'Apple' },
                { id: 'banana', name: 'Banana' },
            ];
            const onChange = vi.fn();
            const Wrapper = () => {
                const [value, setValue] = React.useState<(typeof FRUITS)[number] | undefined>(FRUITS[0]);
                const [search, setSearch] = React.useState('');
                return (
                    <SelectTextField
                        selectionType="single"
                        label="Select a fruit"
                        options={FRUITS}
                        getOptionId="id"
                        getOptionName="name"
                        filter="auto"
                        translations={TRANSLATIONS}
                        hasClearButton={false}
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                            onChange(newValue);
                        }}
                        onSearch={setSearch}
                        searchInputValue={search || undefined}
                    />
                );
            };
            render(<Wrapper />);
            const input = screen.getByRole('combobox');

            await userEvent.click(input);
            await userEvent.type(input, 'b');
            await userEvent.clear(input);
            expect(onChange).not.toHaveBeenCalledWith(undefined);

            await userEvent.tab();
            expect(input).toHaveValue('Apple');
        });

        it('should empty the input when the parent resets searchInputValue to "" with a selection', () => {
            const FRUITS = [
                { id: 'apple', name: 'Apple' },
                { id: 'banana', name: 'Banana' },
            ];
            const renderField = (searchInputValue: string) => (
                <SelectTextField
                    selectionType="single"
                    label="Select a fruit"
                    options={FRUITS}
                    getOptionId="id"
                    getOptionName="name"
                    filter="manual"
                    translations={TRANSLATIONS}
                    value={FRUITS[0]}
                    onChange={vi.fn()}
                    searchInputValue={searchInputValue}
                />
            );
            const { rerender } = render(renderField('cher'));
            const input = screen.getByRole('combobox');
            expect(input).toHaveValue('cher');

            rerender(renderField(''));
            expect(input).toHaveValue('');
        });
    });
});
