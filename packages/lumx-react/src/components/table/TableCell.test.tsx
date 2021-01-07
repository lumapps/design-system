import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite } from '@lumx/react/testing/utils';

import { TableCell, TableCellProps } from './TableCell';

const CLASSNAME = TableCell.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableCellProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<TableCell {...(props as any)} />);
    const cell = wrapper.find(`.${CLASSNAME}`);
    return { props, wrapper, cell };
};

describe(`<${TableCell.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuite(setup, { className: 'cell', prop: 'cell' }, { className: CLASSNAME });
});
