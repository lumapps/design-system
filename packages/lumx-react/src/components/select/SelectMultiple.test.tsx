import React from 'react';

import { Theme } from '@lumx/core/js/constants';
import { Chip } from '@lumx/react/components/chip/Chip';
import { Dropdown } from '@lumx/react/components/dropdown/Dropdown';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, within } from '@testing-library/react';
import {
    getAllByClassName,
    getByClassName,
    queryAllByClassName,
    queryByClassName,
} from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';

import { SelectMultiple, SelectMultipleProps } from './SelectMultiple';
import { SelectVariant } from './constants';

const CLASSNAME = SelectMultiple.className as string;

vi.mock('@lumx/react/hooks/useId', () => ({ useId: () => ':r1:' }));

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<SelectMultipleProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const setupProps: SelectMultipleProps = {
        children: <span>Select Component</span>,
        value: [],
        ...props,
    };
    render(<SelectMultiple {...setupProps} />, { wrapper });
    const select = getByClassName(document.body, CLASSNAME);
    const getDropdown = () => queryByClassName(document.body, Dropdown.className as string);
    const helpers = queryAllByClassName(select, `${CLASSNAME}__helper`);
    const inputWrapper = queryByClassName(select, `${CLASSNAME}__wrapper`);
    const chip = !inputWrapper ? queryByClassName(select, Chip.className as string) : null;
    const valueChips = queryByClassName(select, `${CLASSNAME}__chips`);
    return { props, select, getDropdown, helpers, inputWrapper, chip, valueChips };
};

describe('<SelectMultiple>', () => {
    describe('Props', () => {
        it('should have default classNames', () => {
            const { select, inputWrapper, valueChips, chip } = setup();

            expect(inputWrapper).toBeInTheDocument();
            expect(valueChips).toBeEmptyDOMElement();
            expect(chip).not.toBeInTheDocument();
            expect(select.className).toMatchInlineSnapshot(
                '"lumx-select lumx-select--has-multiple lumx-select lumx-select--is-empty lumx-select--theme-light"',
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

        it('should use the given `value`', () => {
            const { select, valueChips } = setup({ value: ['val1', 'val2'] });

            expect(select).not.toHaveClass(`${CLASSNAME}--is-empty`);
            expect(select).toHaveClass(`${CLASSNAME}--has-value`);
            expect(valueChips).not.toBeEmptyDOMElement();
            expect(within(valueChips as any).queryByText('val1')).toBeInTheDocument();
            expect(within(valueChips as any).queryByText('val2')).toBeInTheDocument();
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

        describe('chip variant', () => {
            it('should render chip variant', () => {
                const { select, inputWrapper, chip } = setup({ variant: SelectVariant.chip });
                expect(inputWrapper).not.toBeInTheDocument();
                expect(chip).toBeInTheDocument();
                expect(select.className).toMatchInlineSnapshot(
                    '"lumx-select lumx-select--has-multiple lumx-select lumx-select--is-empty lumx-select--theme-light"',
                );
            });

            it('should render chip variant with value', () => {
                const { select, chip } = setup({ variant: SelectVariant.chip, value: ['val1', 'val2'] });
                expect(chip).toHaveTextContent('val1 +1');
                expect(select.className).toMatchInlineSnapshot(
                    '"lumx-select lumx-select--has-multiple lumx-select lumx-select--has-value lumx-select--theme-light"',
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
        describe('should trigger `onInputClick` when the select button is clicked', () => {
            it('with input variant', async () => {
                const onClick = vi.fn();
                const { inputWrapper } = setup({ onInputClick: onClick, variant: SelectVariant.input });

                await userEvent.click(inputWrapper as any);
                expect(onClick).toHaveBeenCalled();
            });

            it('with chip variant', async () => {
                const onClick = vi.fn();
                const { chip } = setup({ onInputClick: onClick, variant: SelectVariant.chip });

                await userEvent.click(chip as any);
                expect(onClick).toHaveBeenCalled();
            });
        });

        it('should call onClear when an item is clicked with the correct value', async () => {
            const onClear = vi.fn();
            const { valueChips } = setup({
                onClear,
                value: ['val 1', 'val 2'],
                variant: SelectVariant.input,
            });

            const clearButtons = getAllByClassName(
                valueChips as any,
                `${Chip.className as string}__after--is-clickable`,
            );

            expect(clearButtons.length).toBe(2);

            await userEvent.click(clearButtons[1]);

            expect(onClear).toHaveBeenCalledWith(expect.any(Object), 'val 2');
        });

        it('should clear all with chip variant', async () => {
            const value1 = 'Value 1';
            const value2 = 'Value 2';

            const onClear = vi.fn();
            const { chip } = setup({
                onClear,
                value: [value1, value2],
                variant: SelectVariant.chip,
            });

            const clearButton = getByClassName(chip as any, `${Chip.className as string}__after--is-clickable`);

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
