import { SetupOptions } from '../../../testing';
import { getByClassName } from '../../../testing/queries';
import { CLASSNAME, HeadingProps } from '.';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
export const setup = (
    propsOverride: Partial<HeadingProps> = {},
    { render, ...options }: SetupOptions<HeadingProps>,
) => {
    const props: HeadingProps = {
        children: 'Some text',
        ...propsOverride,
    };

    render(props, options);

    const heading = getByClassName(document.body, CLASSNAME);

    return { heading, props };
};

export default ({ render, screen, ...options }: SetupOptions<HeadingProps>) => {
    describe('Common Render', () => {
        it('should render a Text component with h1 by default', () => {
            setup({ children: 'Some text' }, { render, screen, ...options });
            const heading = screen.getByRole('heading', { level: 1, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-display1');
        });

        it('should render with as with the correct default typography', () => {
            setup({ children: 'Some text', as: 'h2' }, { render, screen, ...options });
            const heading = screen.getByRole('heading', { level: 2, name: 'Some text' });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveClass(CLASSNAME);
            expect(heading).toHaveClass('lumx-typography-headline');
        });
    });
};
