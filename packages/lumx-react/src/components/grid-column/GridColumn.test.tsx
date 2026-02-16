import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import BaseGridColumnTests from '@lumx/core/js/components/GridColumn/GridColumnTests';

import { GridColumn } from './index';

const CLASSNAME = GridColumn.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride = {}) => {
    const props = { ...propsOverride };
    const { container } = render(
        <GridColumn {...props}>
            <p>Content 1</p>
            <p>Content 2</p>
            <p>Content 3</p>
        </GridColumn>,
    );

    const gridColumn = getByClassName(container, CLASSNAME);

    return { props, container, gridColumn };
};

describe(`<${GridColumn.displayName}>`, () => {
    // Run core tests
    BaseGridColumnTests({
        render: (props: any) => render(<GridColumn {...props} />),
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should create default component', () => {
            const { gridColumn } = setup();

            expect(gridColumn).toBeInTheDocument();
            expect(gridColumn.children).toHaveLength(3);
        });

        it('should render as a different element', () => {
            const { container } = render(<GridColumn as="section">Content</GridColumn>);
            expect(container.querySelector('section')).toBeInTheDocument();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'gridColumn',
        forwardClassName: 'gridColumn',
    });
});
