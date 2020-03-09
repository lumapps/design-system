import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { Avatar, AvatarProps, CLASSNAME } from './Avatar';

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
        image: 'http://i.pravatar.cc/40',
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
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper, avatar } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(avatar).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'avatar', prop: 'avatar' }, { className: CLASSNAME });
});
