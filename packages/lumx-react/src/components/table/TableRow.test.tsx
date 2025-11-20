import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { TableRow, TableRowProps } from './TableRow';

const CLASSNAME = TableRow.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableRowProps> = {}) => {
    render(
        <table>
            <tbody>
                <TableRow {...(props as any)} />
            </tbody>
        </table>,
    );
    const tableRow = getByClassName(document.body, CLASSNAME);
    return { props, tableRow };
};

describe(`<${TableRow.displayName}>`, () => {
    it('should render default', () => {
        const content = 'Content';
        const { tableRow } = setup({ children: <td>{content}</td> });
        expect(tableRow).toBe(screen.queryByRole('row', { name: content }));
        expect(tableRow).toHaveAttribute('tabindex', '-1');
        expect(tableRow).not.toHaveAttribute('aria-disabled');
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableRow',
        forwardAttributes: 'tableRow',
        forwardRef: 'tableRow',
    });
});
