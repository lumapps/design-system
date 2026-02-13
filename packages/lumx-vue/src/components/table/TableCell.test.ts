import { render, screen } from '@testing-library/vue';
import BaseTableCellTests, { setup } from '@lumx/core/js/components/Table/TableCellTests';
import { CLASSNAME } from '@lumx/core/js/components/Table/TableCell';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { getByClassName } from '@lumx/core/testing/queries';

import { TableCell } from '.';

describe('<TableCell />', () => {
    const renderTableCell = (props: any, options?: SetupRenderOptions<any>) => {
        const Parent = props?.variant === 'head' ? 'thead' : 'tbody';
        return render(
            {
                template: `<table><${Parent}><tr><TableCell v-bind="props" /></tr></${Parent}></table>`,
                components: { TableCell },
                setup() {
                    return { props };
                },
            },
            options,
        );
    };

    // Run core tests
    BaseTableCellTests({
        render: renderTableCell,
        screen,
    });

    const setupTableCell = (props: any = {}, options: SetupRenderOptions<any> = {}) => {
        const result = setup(props, { ...options, render: renderTableCell, screen });
        // Alias for commonTestsSuite compatibility (use td as default)
        const td = result.tableCell;
        return { ...result, td };
    };

    // Vue-specific tests
    describe('Vue', () => {
        it('should render header variant with icon', () => {
            const icon = 'M12 2L2 22h20L12 2z';
            const content = 'Content';
            const { tableCell } = setupTableCell({ children: content, variant: 'head', icon });
            const iconEl = getByClassName(tableCell, `${CLASSNAME}-icon`);
            expect(iconEl).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupTableCell, {
        baseClassName: CLASSNAME,
        forwardClassName: 'td',
        forwardAttributes: 'td',
        forwardRef: 'td',
    });
});
