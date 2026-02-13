import { render, screen } from '@testing-library/vue';
import BaseTableTests, { setup } from '@lumx/core/js/components/Table/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Table/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Table } from '.';

describe('<Table />', () => {
    const renderTable = (props: any, options?: SetupRenderOptions<any>) =>
        render(Table, {
            ...options,
            props,
        });

    // Run core tests
    BaseTableTests({
        render: renderTable,
        screen,
    });

    const setupTable = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderTable, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupTable, {
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
