import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { GridColumn } from './index';

const CLASSNAME = GridColumn.className;

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
    it('should create default component', () => {
        const { gridColumn } = setup();

        expect(gridColumn).toBeInTheDocument();
        expect(gridColumn.children).toHaveLength(3);
    });

    describe('Props', () => {
        it('should override CSS props', () => {
            const { gridColumn } = setup({
                gap: 'regular',
                maxColumns: 10,
                itemMinWidth: 300,
            });

            expect(gridColumn).toHaveAttribute(
                'style',
                '--lumx-grid-column-item-min-width: 300px; --lumx-grid-column-columns: 10; --lumx-grid-column-gap: var(--lumx-spacing-unit-regular);',
            );
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardAttributes: 'gridColumn',
        forwardClassName: 'gridColumn',
    });
});
