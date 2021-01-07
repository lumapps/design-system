import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { Table, TableProps } from './Table';
import * as stories from '../../stories/generated/Table/Demos.stories';

const CLASSNAME = Table.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<TableProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<Table {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${Table.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, Table);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
