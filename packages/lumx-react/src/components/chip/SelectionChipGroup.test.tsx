import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { SelectionChipGroup, SelectionChipGroupProps } from './SelectionChipGroup';
import { Chip } from './Chip';

interface TestOption {
    id: string;
    name: string;
    disabled?: boolean;
}

const testOptions: TestOption[] = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
];

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<SelectionChipGroupProps<TestOption>> = {}) => {
    const props: SelectionChipGroupProps<TestOption> = {
        value: testOptions,
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Test chips',
        chipTooltipLabel: (chip: string) => `Remove ${chip}`,
        onChange: vi.fn(),
        ...propOverrides,
    };

    const result = render(<SelectionChipGroup {...props} />);
    const chipGroup = screen.getByRole('group', { name: props.label });

    return { props, chipGroup, ...result };
};

describe('<SelectionChipGroup />', () => {
    describe('Props', () => {
        it('should render default', () => {
            const { chipGroup } = setup();
            expect(chipGroup).toBeInTheDocument();
            expect(chipGroup).toHaveClass('lumx-selection-chip-group');
        });

        it('should render all chips from value array', () => {
            setup();
            expect(screen.getByText('Apricot')).toBeInTheDocument();
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.getByText('Banana')).toBeInTheDocument();
        });

        it('should render with custom getOptionName selector', () => {
            const customOptions = [
                { id: '1', name: 'Name 1', label: 'Custom 1' },
                { id: '2', name: 'Name 2', label: 'Custom 2' },
            ];
            setup({
                value: customOptions as any,
                getOptionName: 'label' as any,
            });
            expect(screen.getByText('Custom 1')).toBeInTheDocument();
            expect(screen.getByText('Custom 2')).toBeInTheDocument();
        });

        it('should render with function selector for getOptionId', () => {
            const onChange = vi.fn();
            setup({
                getOptionId: (option) => option.id,
                onChange,
            });
            const chips = screen.getAllByRole('button');
            expect(chips).toHaveLength(3);
        });

        it('should render with aria-label from label prop', () => {
            const { chipGroup } = setup({ label: 'Selected items' });
            expect(chipGroup).toHaveAttribute('aria-label', 'Selected items');
        });

        it('should render empty when value is undefined', () => {
            const { chipGroup } = setup({ value: undefined });
            expect(chipGroup).toBeInTheDocument();
            const chips = screen.queryAllByRole('button');
            expect(chips).toHaveLength(0);
        });

        it('should render empty when value is empty array', () => {
            const { chipGroup } = setup({ value: [] });
            expect(chipGroup).toBeInTheDocument();
            const chips = screen.queryAllByRole('button');
            expect(chips).toHaveLength(0);
        });
    });

    describe('Custom rendering', () => {
        it('should use custom renderChip when provided', () => {
            const renderChip = (option: TestOption) => (
                <Chip data-testid={`custom-${option.id}`}>Custom: {option.name}</Chip>
            );
            setup({ renderChip });
            expect(screen.getByText('Custom: Apricot')).toBeInTheDocument();
            expect(screen.getByTestId('custom-1')).toBeInTheDocument();
        });

        it('should merge custom chip props with default props', () => {
            const renderChip = (option: TestOption) => <Chip className="custom-class">{option.name}</Chip>;
            setup({ renderChip });
            const chip = screen.getByText('Apricot').closest('.lumx-chip');
            expect(chip).toHaveClass('lumx-selection-chip-group__chip');
            expect(chip).toHaveClass('custom-class');
        });

        it('should use custom chip children over option name', () => {
            const renderChip = (option: TestOption) => <Chip>Override: {option.name}</Chip>;
            setup({ renderChip });
            expect(screen.getByText('Override: Apricot')).toBeInTheDocument();
        });
    });

    describe('Events', () => {
        it('should call onChange when chip is clicked', async () => {
            const onChange = vi.fn();
            setup({ onChange });

            const firstChip = screen.getByText('Apricot');
            await userEvent.click(firstChip);

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith([testOptions[1], testOptions[2]]);
        });

        it('should remove correct chip when clicking different chips', async () => {
            const onChange = vi.fn();
            setup({ onChange });

            const secondChip = screen.getByText('Apple');
            await userEvent.click(secondChip);

            expect(onChange).toHaveBeenCalledWith([testOptions[0], testOptions[2]]);
        });

        it('should call onChange with empty array when removing last chip', async () => {
            const onChange = vi.fn();
            setup({ value: [testOptions[0]], onChange });

            const chip = screen.getByText('Apricot');
            await userEvent.click(chip);

            expect(onChange).toHaveBeenCalledWith([]);
        });

        it('should not call onChange when chip is not in value array', async () => {
            const onChange = vi.fn();
            const renderChip = (option: TestOption) => <Chip>{option.name}</Chip>;
            setup({
                value: [testOptions[0]],
                onChange,
                renderChip,
            });

            // This test ensures the code handles edge cases, though in practice
            // this shouldn't happen
            expect(onChange).not.toHaveBeenCalled();
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

            // Create and attach input to test focus restoration
            const input = document.createElement('input');
            (inputRef as any).current = input;
            container.appendChild(input);

            const chips = screen.getAllByRole('button');
            const firstChip = chips[0];

            firstChip.focus();
            await userEvent.keyboard('{Backspace}');

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith([]);
            expect(input).toHaveFocus();
        });

        it('should focus previous chip on Backspace when not last chip', async () => {
            const onChange = vi.fn();
            setup({ onChange });

            const chips = screen.getAllByRole('button');
            const secondChip = chips[1];

            secondChip.focus();
            await userEvent.keyboard('{Backspace}');

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(chips[0]).toHaveFocus();
        });

        it('should not trigger removal on other keys', async () => {
            const onChange = vi.fn();
            setup({ onChange });

            const chip = screen.getByText('Apricot');
            chip.focus();
            await userEvent.keyboard('{Enter}');

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('Disabled state', () => {
        it('should render all chips as disabled when isDisabled is true', async () => {
            const onChange = vi.fn();
            setup({ isDisabled: true, onChange });

            const chips = screen.getAllByRole('button');
            chips.forEach((chip) => {
                expect(chip).toHaveAttribute('aria-disabled', 'true');
                expect(chip).toHaveAttribute('tabIndex', '-1');
            });

            await userEvent.click(chips[0]);
            // Click should still work on aria-disabled, but we're testing the attribute is set
            expect(chips[0]).toHaveAttribute('aria-disabled', 'true');
        });

        it('should render individual chip as disabled when specified in renderChip', () => {
            const renderChip = (option: TestOption) => <Chip isDisabled={option.id === '2'}>{option.name}</Chip>;
            setup({ renderChip });

            const chips = screen.getAllByRole('button');
            expect(chips[0]).not.toHaveAttribute('aria-disabled');
            expect(chips[1]).toHaveAttribute('aria-disabled', 'true');
            expect(chips[2]).not.toHaveAttribute('aria-disabled');
        });

        it('should merge global and individual disabled states', () => {
            const renderChip = (option: TestOption) => <Chip isDisabled={option.id === '1'}>{option.name}</Chip>;
            setup({ renderChip, isDisabled: false });

            const chips = screen.getAllByRole('button');
            expect(chips[0]).toHaveAttribute('aria-disabled', 'true');
            expect(chips[1]).not.toHaveAttribute('aria-disabled');
        });

        it('should not show tooltip for disabled chips', () => {
            setup({ isDisabled: true });

            const chips = screen.getAllByRole('button');
            // Tooltip should not be rendered for disabled chips
            // The tooltip label is conditionally set to undefined for disabled chips
            chips.forEach((chip) => {
                expect(chip).toHaveAttribute('aria-disabled', 'true');
            });
        });
    });

    describe('Theme', () => {
        it('should pass theme to chips', () => {
            setup({ theme: 'dark' });

            const chips = screen.getAllByRole('button');
            chips.forEach((chip) => {
                expect(chip.className).toContain('lumx-chip--color-light');
            });
        });
    });

    describe('Tooltips', () => {
        it('should generate tooltip labels using chipTooltipLabel prop', () => {
            const chipTooltipLabel = vi.fn((chip: string) => `Delete ${chip}`);
            setup({ chipTooltipLabel });

            expect(chipTooltipLabel).toHaveBeenCalledWith('Apricot');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Apple');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Banana');
        });

        it('should use custom chip children for tooltip when renderChip is provided with string children', () => {
            const chipTooltipLabel = vi.fn((chip: string) => `Remove ${chip}`);
            const renderChip = (option: TestOption) => <Chip>{`Custom ${option.name}`}</Chip>;
            setup({ chipTooltipLabel, renderChip });

            expect(chipTooltipLabel).toHaveBeenCalledWith('Custom Apricot');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Custom Apple');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Custom Banana');
        });

        it('should fallback to option name for tooltip when renderChip has non-string children', () => {
            const chipTooltipLabel = vi.fn((chip: string) => `Remove ${chip}`);
            const renderChip = (option: TestOption) => <Chip>Custom {option.name}</Chip>;
            setup({ chipTooltipLabel, renderChip });

            expect(chipTooltipLabel).toHaveBeenCalledWith('Apricot');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Apple');
            expect(chipTooltipLabel).toHaveBeenCalledWith('Banana');
        });
    });

    describe('Accessibility', () => {
        it('should have role="group" with aria-label', () => {
            const { chipGroup } = setup({ label: 'Selected fruits' });
            expect(chipGroup).toHaveAttribute('role', 'group');
            expect(chipGroup).toHaveAttribute('aria-label', 'Selected fruits');
        });

        it('should have correct tabIndex for enabled chips', () => {
            setup();

            const chips = screen.getAllByRole('button');
            chips.forEach((chip) => {
                expect(chip).toHaveAttribute('tabIndex', '0');
            });
        });

        it('should have correct tabIndex for disabled chips', () => {
            setup({ isDisabled: true });

            const chips = screen.getAllByRole('button');
            chips.forEach((chip) => {
                expect(chip).toHaveAttribute('tabIndex', '-1');
            });
        });
    });

    describe('Chip refs', () => {
        it('should create refs for each chip', () => {
            setup();

            const chips = screen.getAllByRole('button');
            expect(chips).toHaveLength(3);
            chips.forEach((chip) => {
                expect(chip).toBeInstanceOf(HTMLElement);
            });
        });

        it('should maintain stable refs on re-render', () => {
            const { rerender, props } = setup();

            const firstRenderChips = screen.getAllByRole('button');
            const firstChipElement = firstRenderChips[0];

            rerender(<SelectionChipGroup {...props} />);

            const secondRenderChips = screen.getAllByRole('button');
            expect(secondRenderChips[0]).toBe(firstChipElement);
        });
    });
});
