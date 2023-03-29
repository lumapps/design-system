import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { Table, TableProps } from './Table';

const CLASSNAME = Table.className as string;

const setup = (props: Partial<TableProps> = {}) => {
    render(<Table {...(props as any)} />);
    const table = queryByClassName(document.body, CLASSNAME);
    return { props, table };
};

describe(`<${Table.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'table',
        forwardAttributes: 'table',
    });
});
