import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';

import { UserBlock, UserBlockProps } from './UserBlock';
import * as stories from './UserBlock.stories';

const CLASSNAME = UserBlock.className as string;

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
 */
const setup = ({ ...propsOverride }: Partial<UserBlockProps> = {}, shallowRendering = true): Setup => {
    const props: UserBlockProps = {
        ...propsOverride,
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
