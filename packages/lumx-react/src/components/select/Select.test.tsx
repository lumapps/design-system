import React from 'react';

import { Theme } from '@lumx/core/js/constants';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { getByClassName, queryAllByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, within } from '@testing-library/react';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import userEvent from '@testing-library/user-event';
import { isFocusVisible } from '@lumx/react/utils/browser/isFocusVisible';

import { Select, SelectProps, SelectVariant } from './Select';

const CLASSNAME = Select.className as string;

jest.mock('@lumx/react/utils/browser/isFocusVisible');
jest.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<SelectProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: SelectProps = {
        children: <span>Select Component</span>,
        value: '',
        ...propsOverride,
    };
    render(<Select {...props} />, { wrapper });
    const select = getByClassName(document.body, CLASSNAME);
    const getDropdown = () => queryByClassName(document.body, Dropdown.className as string);
    const helpers = queryAllByClassName(select, `${CLASSNAME}__helper`);
    const inputWrapper = queryByClassName(select, `${CLASSNAME}__wrapper`);
    const chip = queryByClassName(select, Chip.className as string);
    return { props, select, getDropdown, helpers, inputWrapper, chip };
};

describe(`<${Select.displayName}>`, () => {
    (isFocusVisible as jest.Mock).mockReturnValue(false);

    describe('Props', () => {
        it('should have default classNames', () => {
            const { select, getDropdown } = setup();
            expect(getDropdown()).not.toBeInTheDocument();
            expect(select.className).toMatchInlineSnapshot(
                '"lumx-select lumx-select--has-unique lumx-select lumx-select--is-empty lumx-select--theme-light"',
            );
        });

        it('should use the given `theme`', () => {
            const { select } = setup({ theme: Theme.dark });
            expect(select).toHaveClass(`${CLASSNAME}--theme-dark`);
        });

        it('should use the given `isValid`', () => {
            const { select } = setup({ isValid: true });
            expect(select).toHaveClass(`${CLASSNAME}--is-valid`);
        });

        it('should use the given `hasError`', () => {
            const { select } = setup({ hasError: true });
            expect(select).toHaveClass(`${CLASSNAME}--has-error`);
        });

        it('should use the given `value`', () => {
            const { select, inputWrapper, props } = setup({ value: 'val1' });
            expect(select).toHaveClass(`${CLASSNAME}--has-unique`);
            expect(select).toHaveClass(`${CLASSNAME}--has-value`);
            expect(select).not.toHaveClass(`${CLASSNAME}--is-empty`);
            expect(inputWrapper).toHaveTextContent(props.value);
        });

        it('should pass the given `isOpen` to the dropdown', () => {
            const { getDropdown } = setup({ isOpen: true });
            expect(getDropdown()).toBeInTheDocument();
        });
        describe('helpers', () => {
            it('should display the given `error`', () => {
                const { select, helpers, props } = setup({ hasError: true, error: 'You are not bold!' });
                expect(select).toHaveClass(`${CLASSNAME}--has-error`);
                expect(helpers.length).toBe(1);
                expect(helpers[0]).toHaveTextContent(props.error as string);
            });

            it('should NOT display the given `error`', () => {
                const { select, helpers } = setup({
                    error: 'You are not bold!',
                    hasError: false,
                });
                expect(select).not.toHaveClass(`${CLASSNAME}--has-error`);
                expect(helpers.length).toBe(0);
            });

            it('should display the given `helper`', () => {
                const { helpers, props } = setup({ helper: 'Be bold' });
                expect(helpers.length).toBe(1);
                expect(helpers[0]).toHaveTextContent(props.helper as string);
            });

            it('should display the given `helper` and `error`', () => {
                const { select, helpers, props } = setup({
                    error: 'You are not bold!',
                    hasError: true,
                    helper: 'Be bold',
                });
                expect(select).toHaveClass(`${CLASSNAME}--has-error`);
                expect(helpers.length).toBe(2);
                expect(helpers[0]).toHaveTextContent(props.error as string);
                expect(helpers[1]).toHaveTextContent(props.helper as string);
            });
        });

        it('should have a data-id as prop', () => {
            const { inputWrapper } = setup({ 'data-id': 'select' });
            expect(inputWrapper).toHaveAttribute('data-id', 'select');
        });

        describe('chip variant', () => {
            it('should render chip variant', () => {
                const { select, inputWrapper, chip } = setup({ variant: SelectVariant.chip });
                expect(inputWrapper).not.toBeInTheDocument();
                expect(chip).toBeInTheDocument();
                expect(select.className).toMatchInlineSnapshot(
                    '"lumx-select lumx-select--has-unique lumx-select lumx-select--is-empty lumx-select--theme-light"',
                );
            });

            it('should render chip variant with value', () => {
                const { select, chip, props } = setup({ variant: SelectVariant.chip, value: 'val1' });
                expect(chip).toHaveTextContent(props.value);
                expect(select.className).toMatchInlineSnapshot(
                    '"lumx-select lumx-select--has-unique lumx-select lumx-select--has-value lumx-select--theme-light"',
                );
            });

            it('should forward prop to chip variant', () => {
                const { chip } = setup({
                    'data-id': 'select',
                    variant: SelectVariant.chip,
                });
                expect(chip).toHaveAttribute('data-id', 'select');
            });
        });
    });

    describe('Events', () => {
        it('should trigger `onDropdownClose` on escape', async () => {
            const onDropdownClose = jest.fn();
            const { getDropdown } = setup({ isOpen: true, onDropdownClose });

            const dropdown = getDropdown();
            expect(dropdown).toBeInTheDocument();

            await userEvent.keyboard('[Escape]');
            expect(onDropdownClose).toHaveBeenCalled();
        });

        describe('should trigger `onInputClick` when the select button is clicked', () => {
            it('with input variant', async () => {
                const onClick = jest.fn();
                const { inputWrapper } = setup({ onInputClick: onClick, variant: SelectVariant.input });

                await userEvent.click(inputWrapper as any);
                expect(onClick).toHaveBeenCalled();
            });

            it('with chip variant', async () => {
                const onClick = jest.fn();
                const { chip } = setup({ onInputClick: onClick, variant: SelectVariant.chip });

                await userEvent.click(chip as any);
                expect(onClick).toHaveBeenCalled();
            });
        });

        it('should call onClear when clear icon is clicked in select input', async () => {
            const value = 'Value';
            const onClear = jest.fn();
            const { select, props } = setup({ value, onClear, clearButtonProps: { label: 'Clear' } });

            const clearButton = within(select).getByRole('button', { name: props.clearButtonProps?.label });

            await userEvent.click(clearButton);
            expect(onClear).toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'select',
        forwardAttributes: 'inputWrapper',
        forwardRef: 'select',
        applyTheme: {
            affects: [{ element: 'select' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
