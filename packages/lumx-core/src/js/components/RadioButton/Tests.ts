import { SetupOptions } from '../../../testing';
import { getByClassName, getByTagName, queryByClassName } from '../../../testing/queries';
import { RadioButtonProps, CLASSNAME } from '.';

type SetupProps = Partial<RadioButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<RadioButtonProps>) => {
    const props: RadioButtonProps = {
        inputId: 'fixedId',
        ...propsOverride,
    };

    render(props, options);

    const radioButton = getByClassName(document.body, CLASSNAME);
    const helper = queryByClassName(radioButton, `${CLASSNAME}__helper`);
    const label = queryByClassName(radioButton, `${CLASSNAME}__label`);
    const input = getByTagName(radioButton, 'input');

    return { radioButton, helper, label, input, props };
};

export default (renderOptions: SetupOptions<RadioButtonProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { radioButton, input, label, helper } = setup({}, renderOptions);
            expect(radioButton).toBeInTheDocument();
            expect(radioButton).toHaveClass(CLASSNAME);
            expect(radioButton).not.toHaveClass('lumx-radio-button--is-disabled');
            expect(radioButton).toHaveClass('lumx-radio-button--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'radio');
            expect(input).not.toBeChecked();
        });

        it('should render disabled and checked', () => {
            const { radioButton, input } = setup(
                {
                    isDisabled: true,
                    isChecked: true,
                },
                renderOptions,
            );
            expect(radioButton).toHaveClass('lumx-radio-button--is-disabled');
            expect(radioButton).toHaveClass('lumx-radio-button--is-checked');

            expect(input).toBeChecked();
        });

        it('should render helper and label', () => {
            const inputId = 'radio1';
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
};
