import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite } from '@lumx/react/testing/utils';

import { TableRow, TableRowProps } from './TableRow';

const CLASSNAME = TableRow.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableRowProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<TableRow {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${TableRow.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
