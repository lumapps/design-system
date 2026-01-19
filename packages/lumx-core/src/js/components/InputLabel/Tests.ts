import { Theme, Typography } from '../../constants';
import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { InputLabel, InputLabelProps } from '.';
import { classNames } from '../../utils';

const CLASSNAME = InputLabel.className as string;

type SetupProps = Partial<InputLabelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<InputLabelProps>) => {
    const props: InputLabelProps = {
        children: 'Label text',
        htmlFor: '123',
        ...propsOverride,
    };

    render(props, options);

    const label = getByClassName(document.body, CLASSNAME);

    return { label, props };
};

export default (renderOptions: SetupOptions<InputLabelProps>) => {
    describe('Props', () => {
        it('should render text', () => {
            const { label, props } = setup(
                {
                    children: 'Some label text',
                    htmlFor: '123',
                },
                renderOptions,
            );
            expect(label).toHaveTextContent(props.children as string);
            expect(label).toHaveAttribute('for', props.htmlFor);
        });

        it('should render dark theme & required', () => {
            const { label } = setup({ children: 'The label', theme: Theme.dark, isRequired: true }, renderOptions);
            expect(label).toHaveClass(CLASSNAME);
            expect(label).toHaveClass(`${CLASSNAME}--theme-dark`);
            expect(label).toHaveClass(`${CLASSNAME}--is-required`);
        });

        it('should render typography', () => {
            const { label } = setup({ children: 'The label', typography: Typography.body1 }, renderOptions);
            expect(label).toHaveClass(CLASSNAME);
            expect(label).toHaveClass(classNames.typography(Typography.body1));
        });
    });
};
