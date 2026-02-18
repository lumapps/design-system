import { SetupOptions } from '../../../testing';
import { getByClassName, getByTagName, queryByClassName } from '../../../testing/queries';
import { SwitchProps, CLASSNAME } from '.';

type SetupProps = Partial<SwitchProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<SwitchProps>) => {
    const props: SwitchProps = {
        inputId: 'fixedId',
        ...propsOverride,
    };

    render(props, options);

    const switchWrapper = getByClassName(document.body, CLASSNAME);
    const helper = queryByClassName(switchWrapper, `${CLASSNAME}__helper`);
    const label = queryByClassName(switchWrapper, `${CLASSNAME}__label`);
    const input = getByTagName(switchWrapper, 'input');

    return { switchWrapper, helper, label, input, props };
};

export default (renderOptions: SetupOptions<SwitchProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { switchWrapper, input, label, helper } = setup({}, renderOptions);
            expect(switchWrapper).toBeInTheDocument();
            expect(switchWrapper).toHaveClass(CLASSNAME);
            expect(switchWrapper).not.toHaveClass('lumx-switch--is-disabled');
            expect(switchWrapper).toHaveClass('lumx-switch--is-unchecked');

            expect(label).not.toBeInTheDocument();
            expect(helper).not.toBeInTheDocument();

            expect(input).toBeInTheDocument();
            expect(input).not.toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'false');
        });

        it('should render disabled and checked', () => {
            const { switchWrapper, input } = setup(
                {
                    isDisabled: true,
                    isChecked: true,
                },
                renderOptions,
            );
            expect(switchWrapper).toHaveClass('lumx-switch--is-disabled');
            expect(switchWrapper).toHaveClass('lumx-switch--is-checked');

            expect(input).toBeChecked();
            expect(input).toHaveAttribute('aria-checked', 'true');
        });

        it('should render helper and label', () => {
            const inputId = 'switch1';
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

        it('should apply position class', () => {
            const { switchWrapper } = setup({ position: 'right' }, renderOptions);
            expect(switchWrapper).toHaveClass('lumx-switch--position-right');
        });

        it('should apply default position class (left)', () => {
            const { switchWrapper } = setup({}, renderOptions);
            expect(switchWrapper).toHaveClass('lumx-switch--position-left');
        });
    });

    describe('Switch-specific', () => {
        it('should have role="switch" on input', () => {
            const { input } = setup({}, renderOptions);
            expect(input).toHaveAttribute('role', 'switch');
            expect(input).toHaveAttribute('type', 'checkbox');
        });
    });
};
