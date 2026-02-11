import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { DividerProps, CLASSNAME } from '.';

type SetupProps = Partial<DividerProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<DividerProps>) => {
    const props: DividerProps = {
        ...propsOverride,
    };

    render(props, options);

    const divider = getByClassName(document.body, CLASSNAME);

    return { divider, props };
};

export default (renderOptions: SetupOptions<DividerProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { divider } = setup({}, renderOptions);
            expect(divider).toBeInTheDocument();
            expect(divider).toHaveClass(CLASSNAME);
        });

        it('should render with theme', () => {
            const { divider } = setup({ theme: 'dark' }, renderOptions);
            expect(divider).toHaveClass(`${CLASSNAME}--theme-dark`);
        });

        it('should render with custom className', () => {
            const { divider } = setup({ className: 'custom-class' }, renderOptions);
            expect(divider).toHaveClass(CLASSNAME);
            expect(divider).toHaveClass('custom-class');
        });
    });
};
