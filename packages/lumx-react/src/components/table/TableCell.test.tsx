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
    it('should render default with base class name and content wrapper', () => {
        const content = 'Content';
        const { tableCell } = setup({ children: content });
        expect(tableCell).toBe(screen.queryByRole('cell', { name: content }));
        expect(tableCell).toHaveClass(CLASSNAME);
        const contentEl = getByClassName(tableCell, `${CLASSNAME}-content`);
        expect(contentEl).toBeInTheDocument();
    });

    it('should render header variant with head class and icon', () => {
        const icon = 'M12 2L2 22h20L12 2z';
        const content = 'Content';
        const { tableCell } = setup({ children: content, variant: 'head', icon });
        expect(tableCell).toBe(screen.queryByRole('columnheader', { name: content }));
        expect(tableCell).toHaveClass(`${CLASSNAME}--head`);
        const iconEl = getByClassName(tableCell, `${CLASSNAME}-icon`);
        expect(iconEl).toBeInTheDocument();
    });

    it('should render header variant clickable with wrapper class', async () => {
        const content = 'Content';
        const onHeaderClick = vi.fn();
        const { tableCell } = setup({ children: content, variant: 'head', onHeaderClick });

        const headerButton = within(tableCell).getByRole('button', { name: content });
        await userEvent.click(headerButton);
        expect(onHeaderClick).toHaveBeenCalled();

        const wrapper = getByClassName(tableCell, `${CLASSNAME}-wrapper`);
        expect(wrapper).toBeInTheDocument();
    });

    it('should render header sortable with is-sortable class and icon', () => {
        const { tableCell } = setup({ variant: 'head', isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'none');
        expect(tableCell).toHaveClass(`${CLASSNAME}--is-sortable`);
    });

    it('should render header sortable ascending with is-sorted class and icon', () => {
        const { tableCell } = setup({ variant: 'head', sortOrder: ThOrder.asc, isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'ascending');
        expect(tableCell).toHaveClass(`${CLASSNAME}--is-sorted`);
        const iconEl = getByClassName(tableCell, `${CLASSNAME}-icon`);
        expect(iconEl).toBeInTheDocument();
    });

    it('should render header sortable descending with is-sorted class and icon', () => {
        const { tableCell } = setup({ variant: 'head', sortOrder: ThOrder.desc, isSortable: true });
        expect(tableCell).toHaveAttribute('aria-sort', 'descending');
        expect(tableCell).toHaveClass(`${CLASSNAME}--is-sorted`);
        const iconEl = getByClassName(tableCell, `${CLASSNAME}-icon`);
        expect(iconEl).toBeInTheDocument();
    });

    it('should have body variant class', () => {
        const { tableCell } = setup({ children: 'Content', variant: 'body' });
        expect(tableCell).toHaveClass(`${CLASSNAME}--body`);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableCell',
        forwardAttributes: 'tableCell',
    });
});
