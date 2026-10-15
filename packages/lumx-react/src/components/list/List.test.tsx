import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import BaseListTests from '@lumx/core/js/components/List/ListTests';
import { List as ListUI } from '@lumx/core/js/components/List';
import { List, ListProps } from './List';

const CLASSNAME = List.className as string;

const setup = (props: Partial<ListProps> = {}) => {
    const propsOverride = {
        children: <li>Item</li>,
        ...props,
    };
    render(<List {...(propsOverride as any)} />);
    const list = queryByClassName(document.body, CLASSNAME);
    return { props: propsOverride, list };
};

describe(`<${List.displayName}>`, () => {
    // Run core tests
    BaseListTests({
        render: (props: ListProps) => render(<List {...(props as any)} />),
        screen,
    });

    // Core only (not a prop of the React component).
    describe('core template `as` prop', () => {
        it('should render the root element with the given tag', () => {
            render(ListUI({ as: 'div', children: 'Item' }));
            const list = queryByClassName(document.body, CLASSNAME);
            expect(list?.tagName).toBe('DIV');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'list', forwardAttributes: 'list' });
});
