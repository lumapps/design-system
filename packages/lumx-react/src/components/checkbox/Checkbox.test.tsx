import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { getByClassName, getByTagName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, CheckboxProps } from './Checkbox';

const CLASSNAME = Checkbox.className as string;

type SetupProps = Partial<CheckboxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { id: 'fixedId', ...propsOverride };
    render(<Checkbox {...props} />, { wrapper });

    const checkbox = getByClassName(document.body, CLASSNAME);
    const helper = queryByClassName(checkbox, `${CLASSNAME}__helper`);
    const label = queryByClassName(checkbox, `${CLASSNAME}__label`);
    const input = getByTagName(checkbox, 'input');
    return { checkbox, helper, label, input, props };
};

describe(`<${Checkbox.displayName}>`, () => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { checkbox, input, label, helper } = setup();
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveClass(CLASSNAME);
            expect(checkbox).not.toHaveClass('lumx-checkbox--is-disabled');
            expect(checkbox).toHaveClass('lumx-checkbox--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).not.toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'false');
            expect(input).not.toBeDisabled();
        });

        it('should render disabled and checked', () => {
            const { checkbox, input } = setup({
                isDisabled: true,
                isChecked: true,
            });
            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(checkbox).toHaveClass('lumx-checkbox--is-checked');

            expect(input).toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'true');
            expect(input).toBeDisabled();
        });

        it('should render intermediate state', () => {
            const { checkbox, input } = setup({
                isChecked: 'intermediate',
            });
            expect(checkbox).toHaveClass('lumx-checkbox--is-checked');

            expect(input).toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'mixed');
        });

        it('should render helper and label', () => {
            const id = 'checkbox1';
            const { props, helper, label, input } = setup({
                id,
                helper: 'Test helper',
                label: 'Test label',
            });

            expect(helper).toBeInTheDocument();
            expect(helper).toHaveTextContent(props.helper);
            expect(helper).toHaveAttribute('id');

            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent(props.label);
            expect(label).toHaveAttribute('for', id);

            expect(input).toHaveAttribute('id', id);
            expect(input).toHaveAttribute('aria-describedby', helper?.id);
        });

        it('should forward input props', () => {
            const { props, input } = setup({
                inputProps: {
                    'aria-labelledby': 'labelledby-id',
                },
            });

            expect(input).toHaveAttribute('aria-labelledby', props.inputProps['aria-labelledby']);
        });
    });

    describe('Events', () => {
        const onChange = vi.fn();

        it('should trigger `onChange` when checkbox is clicked', async () => {
            const value = 'value';
            const name = 'name';
            const { input } = setup({ checked: false, onChange, value, name });
            expect(input).not.toBeChecked();

            await userEvent.click(input);

            expect(onChange).toHaveBeenCalledWith(true, value, name, expect.any(Object));
        });
    });

    describe('Disabled state', () => {
        it('should be disabled with isDisabled', async () => {
            const onChange = vi.fn();
            const { checkbox, input } = setup({ isDisabled: true, onChange });

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(input).toBeDisabled();

            // Should not trigger onChange.
            await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should be disabled with aria-disabled', async () => {
            const onChange = vi.fn();
            const { checkbox, input } = setup({ 'aria-disabled': true, onChange });

            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            // Note: input is not disabled (so it can be focused) but it's readOnly.
            expect(input).not.toBeDisabled();
            expect(input).toHaveAttribute('aria-disabled', 'true');
            expect(input).toHaveAttribute('readOnly');

            // Should not trigger onChange.
            await userEvent.click(input);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'checkbox',
        forwardAttributes: 'checkbox',
        applyTheme: {
            affects: [{ element: 'checkbox' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
