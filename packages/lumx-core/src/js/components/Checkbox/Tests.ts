import { mdiCheck, mdiMinus } from '@lumx/icons';
import { SetupOptions } from '../../../testing';
import { getByClassName, getByTagName, queryByClassName } from '../../../testing/queries';
import { CheckboxProps, CLASSNAME } from '.';

type SetupProps = Partial<CheckboxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<CheckboxProps>) => {
    const props: CheckboxProps = {
        inputId: 'fixedId',
        ...propsOverride,
    };

    render(props, options);

    const checkbox = getByClassName(document.body, CLASSNAME);
    const helper = queryByClassName(checkbox, `${CLASSNAME}__helper`);
    const label = queryByClassName(checkbox, `${CLASSNAME}__label`);
    const input = getByTagName(checkbox, 'input');

    return { checkbox, helper, label, input, props };
};

export default (renderOptions: SetupOptions<CheckboxProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { checkbox, input, label, helper } = setup({}, renderOptions);
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).toHaveClass(CLASSNAME);
            expect(checkbox).not.toHaveClass('lumx-checkbox--is-disabled');
            expect(checkbox).toHaveClass('lumx-checkbox--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).not.toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'false');
        });

        it('should render disabled and checked', () => {
            const { checkbox, input } = setup(
                {
                    isDisabled: true,
                    isChecked: true,
                },
                renderOptions,
            );
            expect(checkbox).toHaveClass('lumx-checkbox--is-disabled');
            expect(checkbox).toHaveClass('lumx-checkbox--is-checked');

            expect(input).toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'true');
        });

        it('should render intermediate state', () => {
            const { checkbox, input } = setup(
                {
                    isChecked: 'intermediate',
                },
                renderOptions,
            );
            expect(checkbox).toHaveClass('lumx-checkbox--is-checked');

            expect(input).toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'mixed');
        });

        it('should render helper and label', () => {
            const inputId = 'checkbox1';
            const { props, helper, label, input } = setup(
                {
                    inputId,
                    helper: 'Test helper',
                    label: 'Test label',
                },
                renderOptions,
            );

            expect(helper).toBeInTheDocument();
            expect(helper).toHaveTextContent(props.helper as string);
            expect(helper).toHaveAttribute('id');

            expect(label).toBeInTheDocument();
            expect(label).toHaveTextContent(props.label as string);
            expect(label).toHaveAttribute('for', inputId);

            expect(input).toHaveAttribute('id', inputId);
            expect(input).toHaveAttribute('aria-describedby', helper?.id);
        });

        it('should forward input props', () => {
            const { props, input } = setup(
                {
                    inputProps: {
                        'aria-labelledby': 'labelledby-id',
                    },
                },
                renderOptions,
            );

            expect(input).toHaveAttribute('aria-labelledby', props.inputProps?.['aria-labelledby']);
        });

        it('should forward name and value to input', () => {
            const { input } = setup({ name: 'test-name', value: 'test-value' }, renderOptions);
            expect(input).toHaveAttribute('name', 'test-name');
            expect(input).toHaveAttribute('value', 'test-value');
        });
    });

    describe('Icon Rendering', () => {
        it('should render check icon when checked', () => {
            const { checkbox } = setup({ isChecked: true }, renderOptions);
            const path = checkbox.querySelector('path');
            expect(path).toHaveAttribute('d', mdiCheck);
        });

        it('should render minus icon when intermediate', () => {
            const { checkbox } = setup({ isChecked: 'intermediate' }, renderOptions);
            const path = checkbox.querySelector('path');
            expect(path).toHaveAttribute('d', mdiMinus);
        });
    });
};
