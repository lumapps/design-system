import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import BaseBadgeTests from '@lumx/core/js/components/Badge/Tests';
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
    // Run core tests
    BaseBadgeTests({
        render: (props: BadgeProps) => render(<Badge {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render empty children', () => {
            const { badge } = setup({ children: null });
            expect(badge).toBeInTheDocument();
            expect(badge).toBeEmptyDOMElement();
        });
    });

    // Common tests suite (React-specific).
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'badge',
        forwardAttributes: 'badge',
        forwardRef: 'badge',
    });
});
