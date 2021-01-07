import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite } from '@lumx/react/testing/utils';

import { TableBody, TableBodyProps } from './TableBody';

const CLASSNAME = TableBody.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableBodyProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<TableBody {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${TableBody.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
