import React from 'react';

import { CommonSetup, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CLASSNAME, ListSubheader, ListSubheaderProps } from './ListSubheader';
import * as stories from './ListSubheader.stories';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: Partial<ListSubheaderProps> = {}, shallowRendering = true): CommonSetup => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<ListSubheader {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${ListSubheader.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        expectStoriesToMatchSnapshots(stories, ListSubheader);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
