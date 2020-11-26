import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite, expectStoriesToMatchSnapshots } from '@lumx/react/testing/utils';

import { Avatar, AvatarProps, CLASSNAME } from './Avatar';
import * as stories from './Avatar.stories';

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    avatar: Wrapper;
    props: Partial<AvatarProps>;

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
const setup = ({ ...propsOverrides }: Partial<AvatarProps> = {}, shallowRendering: boolean = true): Setup => {
    const props: AvatarProps = {
        image: 'path/to/avatar/image.png',
        ...propsOverrides,
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
