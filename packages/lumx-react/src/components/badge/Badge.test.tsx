import { ColorPalette } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { Badge, BadgeProps } from './Badge';

const CLASSNAME = Badge.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<BadgeProps> = {}) => {
    const props: BadgeProps = {
        children: <span>30</span>,
        ...propsOverride,
    };
    render(<Badge {...props} />);
    const badge = getByClassName(document.body, CLASSNAME);
    return { badge, props };
};

describe(`<${Badge.displayName}>`, () => {
    describe('Props', () => {
        it('should use default props', () => {
            const { badge } = setup();

            expect(badge.className).toMatchInlineSnapshot('"lumx-badge lumx-badge--color-primary"');
            expect(badge).toHaveTextContent(/30/);
        });

        it('should render color', () => {
            const { badge } = setup({ color: ColorPalette.red });

            expect(badge).toHaveClass('lumx-badge--color-red');
        });
    });

    describe('Content Rendering', () => {
        it('should render string content', () => {
            setup({ children: 'New Content' });
            expect(screen.getByText('New Content')).toBeInTheDocument();
        });

        it('should render empty children', () => {
            const { badge } = setup({ children: null });
            expect(badge).toBeInTheDocument();
            expect(badge).toBeEmptyDOMElement();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'badge',
        forwardAttributes: 'badge',
        forwardRef: 'badge',
    });
});
