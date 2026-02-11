import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { SkeletonCircleProps, CLASSNAME } from './SkeletonCircle';

type SetupProps = Partial<SkeletonCircleProps>;

/**
 * Mounts the SkeletonCircle component and returns common DOM elements needed in tests.
 */
export const setup = (propsOverride: SetupProps = {}, { render, ...options }: SetupOptions<SkeletonCircleProps>) => {
    const props: SkeletonCircleProps = {
        size: 'm',
        ...propsOverride,
    };

    render(props, options);

    const skeletonCircle = getByClassName(document.body, CLASSNAME);

    return { skeletonCircle, props };
};

export default (renderOptions: SetupOptions<SkeletonCircleProps>) => {
    describe('Props', () => {
        it('should render with size', () => {
            const { skeletonCircle } = setup({ size: 'xl' }, renderOptions);
            expect(skeletonCircle).toBeInTheDocument();
            expect(skeletonCircle).toHaveClass(`${CLASSNAME}--size-xl`);
        });

        it('should render with color', () => {
            const { skeletonCircle } = setup({ size: 'm', color: 'primary' }, renderOptions);
            expect(skeletonCircle).toHaveClass(`${CLASSNAME}--color-primary`);
        });

        it('should render with theme', () => {
            const { skeletonCircle } = setup({ size: 'm', theme: 'dark' }, renderOptions);
            expect(skeletonCircle).toHaveClass(`${CLASSNAME}--theme-dark`);
        });
    });
};
