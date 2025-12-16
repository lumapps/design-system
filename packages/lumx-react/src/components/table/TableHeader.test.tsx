import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';

import { TableHeader, TableHeaderProps } from './TableHeader';

const CLASSNAME = TableHeader.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: TableHeaderProps = {}) => {
    render(
        <table>
            <TableHeader {...props} />
        </table>,
    );
    const tableHeader = queryByClassName(document.body, CLASSNAME);
    return { props, tableHeader };
};

describe(`<${TableHeader.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableHeader',
        forwardAttributes: 'tableHeader',
        forwardRef: 'tableHeader',
    });
});
