import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseListSectionTests from '@lumx/core/js/components/List/ListSectionTests';
import { ListSection, ListSectionProps } from './ListSection';

const CLASSNAME = ListSection.className as string;

const setup = (props: Partial<ListSectionProps> = {}) => {
    const propsOverride: ListSectionProps = {
        label: 'Section label',
        children: <li>Item</li>,
        ...props,
    };
    render(<ListSection {...propsOverride} />);
    const listSection = getByClassName(document.body, CLASSNAME);
    const title = queryByClassName(listSection, `${CLASSNAME}__title`);
    const items = queryByClassName(listSection, `${CLASSNAME}__items`);
    return { props: propsOverride, listSection, title, items };
};

describe(`<${ListSection.displayName}>`, () => {
    // Run core tests
    BaseListSectionTests({
        render: (props: ListSectionProps) => render(<ListSection {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render children inside the items list', () => {
            setup({ children: <li data-testid="child-item">Child</li> });
            expect(screen.getByTestId('child-item')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listSection',
        forwardAttributes: 'listSection',
        forwardRef: 'listSection',
    });
});
