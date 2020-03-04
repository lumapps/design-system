import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mdiAccount } from '@lumx/icons';

import { CLASSNAME, DEFAULT_PROPS, SideNavigationItem, SideNavigationItemProps } from './SideNavigationItem';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<SideNavigationItemProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    root: Wrapper;
    link: Wrapper;
    chevron: Wrapper;
    children: Wrapper;
    icon: Wrapper;
    label: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                    The props to use to override the default props of the component.
 * @param  [shallowRendering=true]  Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const props: Partial<SideNavigationItemProps> = {
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
    const wrapper: Wrapper = renderer(<SideNavigationItem {...props} />);

    return {
        chevron: wrapper.find(`.${CLASSNAME}__chevron`),
        children: wrapper.find(`.${CLASSNAME}__children`),
        icon: wrapper.find(`.${CLASSNAME}__icon`),
        label: wrapper.find(`.${CLASSNAME}__link span`),
        link: wrapper.find(`.${CLASSNAME}__link`),
        props,
        root: wrapper.find(`.${CLASSNAME}`),
        wrapper,
    };
};

describe(`<${SideNavigationItem.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { root, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { root } = setup();

            for (const prop of Object.keys(DEFAULT_PROPS)) {
                const className = getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] });
                if (className) {
                    expect(root).toHaveClassName(className);
                }
            }
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onClick: jest.Mock = jest.fn();

        beforeEach(onClick.mockClear);

        it('should trigger `onClick`', () => {
            const { link } = setup({ onClick }, false);
            link.simulate('click');
            expect(onClick).toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Here is an example of children types check.

        const items = [<SideNavigationItem key="a" label="a" />, <SideNavigationItem key="b" label="b" />];

        it('should hide chevron when no children are passed', () => {
            const { chevron } = setup({
                children: [],
            });

            expect(chevron).not.toExist();
        });

        it('should show chevron when children are passed', () => {
            const { chevron } = setup({
                children: items,
            });

            expect(chevron).toExist();
        });

        it('should hide children when children are passed and isOpen is false', () => {
            const { children } = setup({
                children: items,
                isOpen: false,
            });

            expect(children).not.toExist();
        });

        it('should show children when children are passed and isOpen is true', () => {
            const { children } = setup({
                children: items,
                isOpen: true,
            });

            expect(children).toExist();
        });

        it('should show icon when provided', () => {
            const { icon } = setup({
                icon: mdiAccount,
            });

            expect(icon).toExist();
        });
    });

    // 5. Test state => no state

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
