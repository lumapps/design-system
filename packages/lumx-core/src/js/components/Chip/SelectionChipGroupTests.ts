import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { queryByClassName } from '../../../testing/queries';
import { SetupOptions } from '../../../testing';
import { CLASSNAME } from './SelectionChipGroup';

const testOptions = [
    { id: '1', name: 'Apricot' },
    { id: '2', name: 'Apple' },
    { id: '3', name: 'Banana' },
];

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
    const props = {
        value: testOptions,
        getOptionId: 'id',
        getOptionName: 'name',
        label: 'Test chips',
        chipRemoveLabel: 'Remove',
        ...propsOverride,
    };
    const wrapper = render(props, options);
    const selectionChipGroup = queryByClassName(document.body, CLASSNAME);
    return { props, selectionChipGroup, wrapper };
};

interface CoreTestOptions extends SetupOptions<any> {
    /**
     * Render a stateful SelectionChipGroup that updates its own value on change.
     * When provided, enables roving tabindex recovery tests.
     */
    renderStateful?: () => void;
}

export default (renderOptions: CoreTestOptions) => {
    const { screen, renderStateful } = renderOptions;

    describe('SelectionChipGroup core tests', () => {
        describe('Props', () => {
            it('should render default', () => {
                const { selectionChipGroup } = setup({}, renderOptions);
                expect(selectionChipGroup).toBeInTheDocument();
                expect(selectionChipGroup).toHaveClass(CLASSNAME);
            });

            it('should render all chips from value array', () => {
                setup({}, renderOptions);
                expect(screen.getByText('Apricot')).toBeInTheDocument();
                expect(screen.getByText('Apple')).toBeInTheDocument();
                expect(screen.getByText('Banana')).toBeInTheDocument();
            });

            it('should render with custom getOptionName selector', () => {
                const customOptions = [
                    { id: '1', name: 'Name 1', label: 'Custom 1' },
                    { id: '2', name: 'Name 2', label: 'Custom 2' },
                ];
                setup({ value: customOptions, getOptionName: 'label' }, renderOptions);
                expect(screen.getByText('Custom 1')).toBeInTheDocument();
                expect(screen.getByText('Custom 2')).toBeInTheDocument();
            });

            it('should render with aria-label from label prop', () => {
                setup({ label: 'Selected items' }, renderOptions);
                const chipGroup = screen.getByRole('listbox', { name: 'Selected items' });
                expect(chipGroup).toBeInTheDocument();
            });

            it('should have role="listbox" with aria-multiselectable and aria-orientation', () => {
                setup({}, renderOptions);
                const chipGroup = screen.getByRole('listbox');
                expect(chipGroup).toHaveAttribute('aria-multiselectable', 'true');
                expect(chipGroup).toHaveAttribute('aria-orientation', 'horizontal');
            });

            it('should render chips with role="option" and aria-selected', () => {
                setup({}, renderOptions);
                const chips = screen.getAllByRole('option');
                expect(chips).toHaveLength(3);
                for (const chip of chips) {
                    expect(chip).toHaveAttribute('aria-selected', 'true');
                }
            });

            it('should concatenate chip name and chipRemoveLabel in chip aria-label', () => {
                setup({ chipRemoveLabel: 'Remove' }, renderOptions);
                const chips = screen.getAllByRole('option');
                expect(chips[0]).toHaveAttribute('aria-label', 'Apricot - Remove');
                expect(chips[1]).toHaveAttribute('aria-label', 'Apple - Remove');
                expect(chips[2]).toHaveAttribute('aria-label', 'Banana - Remove');
            });

            it('should use chip name as aria-label when chipRemoveLabel is not provided', () => {
                setup({ chipRemoveLabel: undefined }, renderOptions);
                const chips = screen.getAllByRole('option');
                expect(chips[0]).toHaveAttribute('aria-label', 'Apricot');
                expect(chips[1]).toHaveAttribute('aria-label', 'Apple');
                expect(chips[2]).toHaveAttribute('aria-label', 'Banana');
            });

            it('should use custom children string from getChipProps in chip aria-label', () => {
                setup(
                    {
                        chipRemoveLabel: 'Remove',
                        getChipProps: (option: any) => ({ children: `Custom ${option.name}` }),
                    },
                    renderOptions,
                );
                const chips = screen.getAllByRole('option');
                expect(chips[0]).toHaveAttribute('aria-label', 'Custom Apricot - Remove');
            });

            it('should render empty when value is undefined', () => {
                setup({ value: undefined }, renderOptions);
                expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            });

            it('should render empty when value is empty array', () => {
                setup({ value: [] }, renderOptions);
                expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
            });
        });

        describe('Disabled state', () => {
            it('should render all chips as disabled when isDisabled is true', () => {
                setup({ isDisabled: true }, renderOptions);
                const chips = screen.getAllByRole('option');
                for (const chip of chips) {
                    expect(chip).toHaveAttribute('aria-disabled', 'true');
                }
            });
        });

        describe('getChipProps', () => {
            it('should apply custom children string from getChipProps', () => {
                setup({ getChipProps: (option: any) => ({ children: `Custom ${option.name}` }) }, renderOptions);
                expect(screen.getByText('Custom Apricot')).toBeInTheDocument();
            });

            it('should apply isDisabled from getChipProps per chip', () => {
                setup({ getChipProps: (option: any) => ({ isDisabled: option.id === '2' }) }, renderOptions);
                const chips = screen.getAllByRole('option');
                expect(chips[0]).not.toHaveAttribute('aria-disabled');
                expect(chips[1]).toHaveAttribute('aria-disabled', 'true');
                expect(chips[2]).not.toHaveAttribute('aria-disabled');
            });

            it('should merge global and individual disabled states', () => {
                setup(
                    {
                        getChipProps: (option: any) => ({ isDisabled: option.id === '1' }),
                        isDisabled: false,
                    },
                    renderOptions,
                );
                const chips = screen.getAllByRole('option');
                expect(chips[0]).toHaveAttribute('aria-disabled', 'true');
                expect(chips[1]).not.toHaveAttribute('aria-disabled');
            });
        });

        describe('Events', () => {
            it('should call onChange when chip is clicked', async () => {
                const onChange = vi.fn();
                setup({ onChange }, renderOptions);

                await userEvent.click(screen.getByText('Apricot'));

                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith([testOptions[1], testOptions[2]]);
            });

            it('should call onChange with correct array when removing middle chip', async () => {
                const onChange = vi.fn();
                setup({ onChange }, renderOptions);

                await userEvent.click(screen.getByText('Apple'));

                expect(onChange).toHaveBeenCalledWith([testOptions[0], testOptions[2]]);
            });

            it('should call onChange with empty array when removing last chip', async () => {
                const onChange = vi.fn();
                setup({ value: [testOptions[0]], onChange }, renderOptions);

                await userEvent.click(screen.getByText('Apricot'));

                expect(onChange).toHaveBeenCalledWith([]);
            });
        });

        describe('Keyboard navigation', () => {
            it('should focus previous chip on Backspace when not last chip', async () => {
                setup({}, renderOptions);
                const chips = screen.getAllByRole('option');
                chips[1].focus();
                await userEvent.keyboard('{Backspace}');
                expect(chips[0]).toHaveFocus();
            });

            it('should call onChange on Enter key', async () => {
                const onChange = vi.fn();
                setup({ onChange }, renderOptions);

                const chips = screen.getAllByRole('option');
                chips[0].focus();
                await userEvent.keyboard('{Enter}');

                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith([testOptions[1], testOptions[2]]);
            });

            it('should call onChange on Space key', async () => {
                const onChange = vi.fn();
                setup({ onChange }, renderOptions);

                const chips = screen.getAllByRole('option');
                chips[1].focus();
                await userEvent.keyboard(' ');

                expect(onChange).toHaveBeenCalledTimes(1);
                expect(onChange).toHaveBeenCalledWith([testOptions[0], testOptions[2]]);
            });

            it('should not trigger onChange on other keys', async () => {
                const onChange = vi.fn();
                setup({ onChange }, renderOptions);

                const chips = screen.getAllByRole('option');
                chips[0].focus();
                await userEvent.keyboard('{ArrowRight}');

                expect(onChange).not.toHaveBeenCalled();
            });
        });

        if (renderStateful) {
            describe('Roving tabindex recovery after chip removal', () => {
                it('should move tabindex to the next chip when clicking the first chip', async () => {
                    renderStateful();

                    const firstChip = screen.getByText('Apricot');
                    await userEvent.click(firstChip);

                    await waitFor(() => {
                        const remainingChips = screen.getAllByRole('option');
                        expect(remainingChips).toHaveLength(2);
                        expect(remainingChips[0]).toHaveAttribute('tabIndex', '0');
                        expect(remainingChips[1]).toHaveAttribute('tabIndex', '-1');
                    });
                });

                it('should move tabindex to the previous chip when removing middle chip via Backspace', async () => {
                    renderStateful();

                    const chips = screen.getAllByRole('option');
                    chips[1].focus();
                    await userEvent.keyboard('{Backspace}');

                    await waitFor(() => {
                        const remainingChips = screen.getAllByRole('option');
                        expect(remainingChips).toHaveLength(2);
                        expect(remainingChips[0]).toHaveAttribute('tabIndex', '0');
                        expect(remainingChips[0]).toHaveFocus();
                    });
                });
            });
        }
    });
};
