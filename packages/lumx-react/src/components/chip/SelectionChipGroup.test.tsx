import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import BaseSelectionChipGroupTests from '@lumx/core/js/components/Chip/SelectionChipGroupTests';
import { SelectionChipGroup, SelectionChipGroupProps } from './SelectionChipGroup';
import { Chip } from './Chip';

const testOptions = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
];
type TestOption = (typeof testOptions)[number];

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<SelectionChipGroupProps<TestOption>> = {}) => {
    const props: SelectionChipGroupProps<TestOption> = {
        value: testOptions,
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Test chips',
        chipRemoveLabel: 'Remove',
        onChange: vi.fn(),
        ...propOverrides,
    };

    const result = render(<SelectionChipGroup {...props} />);
    const chipGroup = screen.queryByRole('listbox', { name: props.label });

    return { props, chipGroup, ...result };
};

const StatefulSelectionChipGroup = (props: Partial<SelectionChipGroupProps<TestOption>>) => {
    const [value, setValue] = useState(props.value ?? testOptions);
    return (
        <SelectionChipGroup
            getOptionId="id"
            getOptionName="name"
            label="Test chips"
            chipRemoveLabel="Remove"
            {...props}
            value={value}
            onChange={(newValue) => setValue(newValue ?? [])}
        />
    );
};

describe('<SelectionChipGroup />', () => {
    // Core tests
    BaseSelectionChipGroupTests({
        render: (props: any) => render(<SelectionChipGroup {...props} />),
        renderStateful: () => render(<StatefulSelectionChipGroup />),
        screen,
    });

    describe('React', () => {
        describe('Custom rendering with renderChip', () => {
            it('should use custom renderChip when provided', () => {
                const renderChip = (option: TestOption) => (
                    <Chip data-testid={`custom-${option.id}`}>Custom: {option.name}</Chip>
                );
                setup({ renderChip });
                expect(screen.getByText('Custom: Apricot')).toBeInTheDocument();
                expect(screen.getByTestId('custom-1')).toBeInTheDocument();
            });

            it('should merge custom chip className with default', () => {
                const renderChip = (option: TestOption) => <Chip className="custom-class">{option.name}</Chip>;
                setup({ renderChip });
                const chip = screen.getByText('Apricot').closest('.lumx-chip');
                expect(chip).toHaveClass('lumx-selection-chip-group__chip');
                expect(chip).toHaveClass('custom-class');
            });

            it('should use custom chip children string over option name', () => {
                const renderChip = (option: TestOption) => <Chip>Override: {option.name}</Chip>;
                setup({ renderChip });
                expect(screen.getByText('Override: Apricot')).toBeInTheDocument();
            });

            it('should render individual chip as disabled when specified in renderChip', () => {
                const renderChip = (option: TestOption) => <Chip isDisabled={option.id === '2'}>{option.name}</Chip>;
                setup({ renderChip });

                const chips = screen.getAllByRole('option');
                expect(chips[0]).not.toHaveAttribute('aria-disabled');
                expect(chips[1]).toHaveAttribute('aria-disabled', 'true');
                expect(chips[2]).not.toHaveAttribute('aria-disabled');
            });
        });

        describe('Keyboard navigation', () => {
            it('should remove chip and focus input on Backspace', async () => {
                const onChange = vi.fn();
                const inputRef = React.createRef<HTMLInputElement>();
                const { container } = setup({
                    value: [testOptions[0]],
                    onChange,
                    inputRef,
                });

                const input = document.createElement('input');
                (inputRef as any).current = input;
                container.appendChild(input);

                const chips = screen.getAllByRole('option');
                const firstChip = chips[0];

                firstChip.focus();
                await userEvent.keyboard('{Backspace}');

                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith([]);
                expect(input).toHaveFocus();
            });
        });

        describe('Accessibility', () => {
            it('should have correct tabIndex for enabled chips (roving tabindex)', () => {
                setup();

                const chips = screen.getAllByRole('option');
                for (const [index, chip] of chips.entries()) {
                    expect(chip).toHaveAttribute('tabIndex', index === 0 ? '0' : '-1');
                }
            });

            it('should have correct tabIndex for disabled chips', () => {
                setup({ isDisabled: true });

                const chips = screen.getAllByRole('option');
                for (const chip of chips) {
                    expect(chip).toHaveAttribute('tabIndex', '-1');
                }
            });
        });
    });
});
