import { SetupOptions } from '../../../testing';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { SkeletonTypographyProps, CLASSNAME } from './SkeletonTypography';

type SetupProps = Partial<SkeletonTypographyProps>;

/**
 * Mounts the SkeletonTypography component and returns common DOM elements needed in tests.
 */
export const setup = (
    propsOverride: SetupProps = {},
    { render, ...options }: SetupOptions<SkeletonTypographyProps>,
) => {
    const props: SkeletonTypographyProps = {
        typography: 'body1',
        ...propsOverride,
    };

    render(props, options);

    const skeletonTypography = getByClassName(document.body, CLASSNAME);
    const inner = queryByClassName(skeletonTypography, `${CLASSNAME}__inner`);

    return { skeletonTypography, inner, props };
};

export default (renderOptions: SetupOptions<SkeletonTypographyProps>) => {
    describe('Props', () => {
        it('should render with typography', () => {
            const { skeletonTypography } = setup({ typography: 'body1' }, renderOptions);
            expect(skeletonTypography).toBeInTheDocument();
            expect(skeletonTypography).toHaveClass(`${CLASSNAME}--typography-body1`);
        });

        it('should render with width', () => {
            const { skeletonTypography } = setup({ typography: 'body1', width: '100px' }, renderOptions);
            expect(skeletonTypography).toHaveStyle('width: 100px');
        });

        it('should render with color', () => {
            const { skeletonTypography } = setup({ typography: 'body1', color: 'primary' }, renderOptions);
            expect(skeletonTypography).toHaveClass(`${CLASSNAME}--color-primary`);
        });

        it('should render with theme', () => {
            const { skeletonTypography } = setup({ typography: 'body1', theme: 'dark' }, renderOptions);
            expect(skeletonTypography).toHaveClass(`${CLASSNAME}--theme-dark`);
        });

        it('should render inner element', () => {
            const { inner } = setup({ typography: 'body1' }, renderOptions);
            expect(inner).toBeInTheDocument();
        });
    });
};
