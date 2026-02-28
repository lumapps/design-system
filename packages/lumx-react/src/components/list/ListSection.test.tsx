import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
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
    describe('Props', () => {
        it('should render the label', () => {
            setup({ label: 'My Section' });
            expect(screen.getByText('My Section')).toBeInTheDocument();
        });

        it('should render children inside the items list', () => {
            setup({ children: <li data-testid="child-item">Child</li> });
            expect(screen.getByTestId('child-item')).toBeInTheDocument();
        });

        it('should render title as a <p> element', () => {
            const { title } = setup();
            expect(title?.tagName).toBe('P');
        });

        it('should render items as a <ul> element', () => {
            const { items } = setup();
            expect(items?.tagName).toBe('UL');
        });
    });

    describe('Accessibility', () => {
        it('should wire aria-labelledby on inner list to the title id', () => {
            const { title, items } = setup();
            const titleId = title?.getAttribute('id');
            expect(titleId).toBeTruthy();
            expect(items).toHaveAttribute('aria-labelledby', titleId);
        });

        it('should be accessible as a group via accessible name', () => {
            setup({ label: 'Fruits', itemsWrapperProps: { role: 'group' } });
            expect(screen.getByRole('group', { name: 'Fruits' })).toBeInTheDocument();
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
