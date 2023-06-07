import React from 'react';

import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { TableCell, TableCellProps } from './TableCell';

const CLASSNAME = TableCell.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableCellProps> = {}) => {
    const Parent = props?.variant === 'head' ? 'thead' : 'tbody';
    render(
        <table>
            <Parent>
                <tr>
                    <TableCell {...(props as any)} />
                </tr>
            </Parent>
        </table>,
    );
    const tableCell = queryByClassName(document.body, CLASSNAME);
    return { props, tableCell };
};

describe(`<${TableCell.displayName}>`, () => {
    it('should render default', () => {
        const content = 'Content';
        const { tableCell } = setup({ children: content });
        expect(tableCell).toBe(screen.queryByRole('cell', { name: content }));
    });

    it('should render header variant', () => {
        const content = 'Content';
        const { tableCell } = setup({ children: content, variant: 'head' });
        expect(tableCell).toBe(screen.queryByRole('columnheader', { name: content }));
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableCell',
        forwardAttributes: 'tableCell',
    });
});
