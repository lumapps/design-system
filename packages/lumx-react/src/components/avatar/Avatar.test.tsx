import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';
import { Avatar, AvatarProps } from './Avatar';
import * as stories from './Avatar.stories';

const CLASSNAME = Avatar.className as string;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    avatar: Wrapper;
    props: Partial<AvatarProps>;
    wrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: Partial<AvatarProps> = {}, shallowRendering = true): Setup => {
    const props: AvatarProps = {
        image: 'path/to/avatar/image.png',
        ...propsOverride,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Avatar {...props} />);

    return {
        avatar: wrapper.find(`div`),
        props,
        wrapper,
    };
};

describe(`<${Avatar.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        expectStoriesToMatchSnapshots(stories, Avatar);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'avatar', prop: 'avatar' }, { className: CLASSNAME });
});
