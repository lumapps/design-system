import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';

import { CLASSNAME, UserBlock, UserBlockProps } from './UserBlock';
import * as stories from './UserBlock.stories';

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: Partial<UserBlockProps>;

    /**
     * The <div> element wrapper.
     */
    wrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: Partial<UserBlockProps> = {}, shallowRendering: boolean = true): Setup => {
    const props: UserBlockProps = {
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<UserBlock {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${UserBlock.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        expectStoriesToMatchSnapshots(stories, UserBlock);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
