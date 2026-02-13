import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseTableCellTests from '@lumx/core/js/components/Table/TableCellTests';
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
    const tableCell = getByClassName(document.body, CLASSNAME);
    return { props, tableCell };
};

describe(`<${TableCell.displayName}>`, () => {
    // Run core tests
    BaseTableCellTests({
        render: (props: TableCellProps) => {
            const Parent = props?.variant === 'head' ? 'thead' : 'tbody';
            return render(
                <table>
                    <Parent>
                        <tr>
                            <TableCell {...props} />
                        </tr>
                    </Parent>
                </table>,
            );
        },
        screen,
    });

    // React-specific tests
    describe('React', () => {
        it('should render header variant with icon', () => {
            const icon = 'M12 2L2 22h20L12 2z';
            const content = 'Content';
            const { tableCell } = setup({ children: content, variant: 'head', icon });
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
    });

    // Common tests suite
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tableCell',
        forwardAttributes: 'tableCell',
    });
});
