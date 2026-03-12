import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { DragHandleProps, CLASSNAME } from '.';

type SetupProps = Partial<DragHandleProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<DragHandleProps>) => {
    const props: DragHandleProps = {
        ...propsOverride,
    };

    render(props, options);

    const handle = getByClassName(document.body, CLASSNAME);

    return { handle, props };
};

export default (renderOptions: SetupOptions<DragHandleProps>) => {
    describe('Props', () => {
        it('should render correctly', () => {
            const { handle } = setup({}, renderOptions);
            expect(handle).toBeInTheDocument();
            expect(handle).toHaveClass(CLASSNAME);
        });

        it('should render icon', () => {
            const { handle } = setup({}, renderOptions);
            expect(handle.querySelector('.lumx-icon')).toBeInTheDocument();
        });

        it('should use dark color for light theme', () => {
            const { handle } = setup({ theme: 'light' }, renderOptions);
            const icon = handle.querySelector('.lumx-icon');
            expect(icon).toHaveClass('lumx-icon--color-dark');
        });

        it('should use light color for dark theme', () => {
            const { handle } = setup({ theme: 'dark' }, renderOptions);
            const icon = handle.querySelector('.lumx-icon');
            expect(icon).toHaveClass('lumx-icon--color-light');
        });

        it('should render with custom className', () => {
            const { handle } = setup({ className: 'custom-class' }, renderOptions);
            expect(handle).toHaveClass(CLASSNAME);
            expect(handle).toHaveClass('custom-class');
        });
    });
};
