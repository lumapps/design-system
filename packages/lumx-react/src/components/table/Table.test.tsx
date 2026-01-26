import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';

import { Table, TableProps } from './Table';

const CLASSNAME = Table.className as string;

const setup = (props: Partial<TableProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    render(<Table {...(props as any)} />, { wrapper });
    const table = queryByClassName(document.body, CLASSNAME);
    return { props, table };
};

describe(`<${Table.displayName}>`, () => {
    it('should render hasBefore', () => {
        const { table } = setup({ hasBefore: true });
        expect(table).toHaveClass(`${CLASSNAME}--has-before`);
    });

    it('should render hasDividers', () => {
        const { table } = setup({ hasDividers: true });
        expect(table).toHaveClass(`${CLASSNAME}--has-dividers`);
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'table',
        forwardAttributes: 'table',
        forwardRef: 'table',
        applyTheme: {
            affects: [{ element: 'table' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
