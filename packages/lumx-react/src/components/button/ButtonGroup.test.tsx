import React, { ReactElement, ReactNode } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import mockConsole from 'jest-mock-console';

import { mdiPlus } from '@lumx/icons';
import { Button, Icon, IconButton } from '@lumx/react';
import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { ButtonGroup, ButtonGroupProps, CLASSNAME } from './ButtonGroup';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<ButtonGroupProps>;

/**
 * Defines what is returned by the setup function.
 */
interface Setup extends CommonSetup {
    /**
     * The properties of the tested component.
     */
    props: SetupProps;

    /**
     * The <div> element that is used as a wrapper for the buttons inside of the <ButtonGroup>.
     */
    group: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of
 *                       the component.
 */
const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const props: ButtonGroupProps = {
        children: (
            <>
                <Button>Label</Button>
                <IconButton icon={mdiPlus} />
            </>
        ),
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<ButtonGroup {...props} />);

    return {
        group: wrapper.find(`.${CLASSNAME}`),

        props,
        wrapper,
    };
};

describe(`<${ButtonGroup.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', () => {
        it('should render correctly a group button', () => {
            const { group, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(group.children().length).toEqual(2);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        beforeEach(() => {
            try {
                // If `console.warn` has been mocked at least one, this exists. So disable TS here.
                // @ts-ignore
                global.console.warn.mockRestore();
            } catch (exception) {
                // Nothing to do here.
            }
        });

        it('should fail when no child is given', () => {
            expect(() => {
                setup({ children: null });
            }).toThrowErrorMatchingSnapshot();
        });

        it('should fail when less than 2 children are given', () => {
            const children: ReactNode = <Button>Label</Button>;

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than <${Button.displayName}>s or <${IconButton.displayName}> is passed as children`, () => {
            mockConsole('debug');

            let children: ReactNode = (
                <>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <span>Label</span>
                    <Icon icon={mdiPlus} />
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <span>Label</span>
                    <span>Label 2</span>
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Button>Label</Button>
                    <Icon icon={mdiPlus} />
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Button>Label</Button>
                    <span>Label</span>>
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Icon icon={mdiPlus} />
                    <Button>Label</Button>
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <span>Label</span>><Button>Label</Button>
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it('should fail when more than 2 children are given', () => {
            const children: ReactNode = (
                <>
                    <Button>Label</Button>
                    <Button>Label 2</Button>
                    <Button>Label 3</Button>
                </>
            );

            expect(() => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'group', prop: 'group' }, { className: CLASSNAME });
});
