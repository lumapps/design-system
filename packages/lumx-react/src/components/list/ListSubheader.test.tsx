import React from 'react';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ListSubheader, ListSubheaderProps } from './ListSubheader';
import * as stories from './ListSubheader.stories';

const CLASSNAME = ListSubheader.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ListSubheaderProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<ListSubheader {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${ListSubheader.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, ListSubheader);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
