import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { ScrollBoxProps, CLASSNAME } from '.';

type SetupProps = Partial<ScrollBoxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (props: SetupProps = {}, { render, ...options }: SetupOptions<ScrollBoxProps>) => {
    const { container } = render(props, options);
    const scrollBox = getByClassName(container, CLASSNAME);
    return { props, scrollBox, container };
};

export default (renderOptions: SetupOptions<ScrollBoxProps>) => {
    describe('Props', () => {
        it('should render default', () => {
            const { scrollBox } = setup({}, renderOptions);
            expect(scrollBox).toBeInTheDocument();
            expect(scrollBox).toHaveClass(CLASSNAME);
            expect(scrollBox).toHaveClass('lumx-flex-box', 'lumx-flex-box--orientation-vertical');
            expect(scrollBox).not.toHaveClass(`${CLASSNAME}--scroll-snap`);
        });

        it('should render children', () => {
            const { scrollBox } = setup({ children: 'Content' }, renderOptions);
            expect(scrollBox).toHaveTextContent('Content');
        });

        it('should apply scrollSnap class', () => {
            const { scrollBox } = setup({ scrollSnap: true }, renderOptions);
            expect(scrollBox).toHaveClass(`${CLASSNAME}--scroll-snap`);
        });

        it('should apply fillSpace class', () => {
            const { scrollBox } = setup({ fillSpace: true }, renderOptions);
            expect(scrollBox).toHaveClass('lumx-flex-box--fill-space');
        });
    });
};
