import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { mdiAccount } from '@lumx/icons';

import { SideNavigationItem, SideNavigationItemProps } from './SideNavigationItem';

const DEFAULT_PROPS = SideNavigationItem.defaultProps as any;
const CLASSNAME = SideNavigationItem.className as string;

type SetupProps = Partial<SideNavigationItemProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: any = {
        toggleButtonProps: { label: 'Toggle' },
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
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

        it('should render correctly with splitted actions', () => {
            const { root, wrapper } = setup({ linkProps: { href: 'http://toto.com' }, onClick: () => null });
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

        const items = [
            <SideNavigationItem key="a" label="a" toggleButtonProps={{ label: 'Toggle' }} />,
            <SideNavigationItem key="b" label="b" toggleButtonProps={{ label: 'Toggle' }} />,
        ];

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

        it('should add props to link when provided', () => {
            const { link } = setup({
                linkProps: {
                    href: '/',
                },
            });

            expect(link.prop('href')).toEqual('/');
        });
    });

    // 5. Test state => no state

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
