import { Kind, Theme } from '../../constants';
import { INPUT_HELPER_CONFIGURATION } from './constants';
import { SetupRenderOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { InputHelper, InputHelperProps } from '.';

const CLASSNAME = InputHelper.className as string;

type SetupProps = Partial<InputHelperProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = <T>(
    propsOverride: SetupProps = {},
    { wrapper, render }: SetupRenderOptions<T, InputHelperProps> = {},
) => {
    const props: InputHelperProps = {
        children: 'Helper text',
        ...propsOverride,
    };

    render?.(props, { wrapper });

    const helper = getByClassName(document.body, CLASSNAME);

    return { helper, props };
};

export default <T>(renderOptions: SetupRenderOptions<T, InputHelperProps>) => {
    describe('Props', () => {
        it('should render text', () => {
            const { props, helper } = setup({ children: 'helper text' }, renderOptions);

            expect(helper).toHaveTextContent(props.children as string);
            expect(helper).toHaveClass(CLASSNAME);
            expect(helper).toHaveClass(`${CLASSNAME}--theme-light`);
        });

        it('should render dark theme', () => {
            const { helper } = setup({ theme: Theme.dark }, renderOptions);
            expect(helper).toHaveClass(`${CLASSNAME}--theme-dark`);
        });

        it.each(Object.values(Kind))('should render kind %s', (kind) => {
            const { helper } = setup({ kind }, renderOptions);
            const { color } = INPUT_HELPER_CONFIGURATION[kind as string] || {};
            if (color) expect(helper).toHaveClass(`${CLASSNAME}--color-${color}`);
        });
    });
};
