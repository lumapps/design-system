import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';

import { TableBody, TableBodyProps } from './TableBody';

const CLASSNAME = TableBody.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableBodyProps> = {}) => {
    render(
        <table>
            <TableBody {...(props as any)} />
        </table>,
    );
    const tableBody = queryByClassName(document.body, CLASSNAME);
    return { props, tableBody };
};

describe(`<${TableBody.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableBody',
        forwardAttributes: 'tableBody',
        forwardRef: 'tableBody',
    });
});
