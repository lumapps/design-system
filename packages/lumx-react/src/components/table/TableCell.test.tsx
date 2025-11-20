import React from 'react';

import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TableCell, TableCellProps, ThOrder } from './TableCell';

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
    const tableCell = getByClassName(document.body, CLASSNAME);
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

    it('should render header variant clickable', async () => {
        const content = 'Content';
        const onHeaderClick = vi.fn();
        const { tableCell } = setup({ children: content, variant: 'head', onHeaderClick });

        const headerButton = within(tableCell).getByRole('button', { name: content });
        await userEvent.click(headerButton);
        expect(onHeaderClick).toHaveBeenCalled();
    });

    it('should render header sortable', () => {
        const { tableCell } = setup({ variant: 'head', isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'none');
    });

    it('should render header sortable ascending', () => {
        const { tableCell } = setup({ variant: 'head', sortOrder: ThOrder.asc, isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should render header sortable descending', () => {
        const { tableCell } = setup({ variant: 'head', sortOrder: ThOrder.desc, isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'descending');
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableCell',
        forwardAttributes: 'tableCell',
    });
});
