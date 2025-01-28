import React from 'react';

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
