import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { mdiPlus } from '@lumx/icons';
import { Button, IconButton } from '@lumx/react';
import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';

const CLASSNAME = ButtonGroup.className as string;

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

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true): Setup => {
    const props: ButtonGroupProps = {
        children: (
            <>
                <Button>Label</Button>
                <IconButton icon={mdiPlus} />
            </>
        ),
        ...propsOverride,
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

    // 2. Test defaultProps value and important props custom values.
    // N/A

    // 3. Test events.
    // N/A

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    // N/A

    // 5. Test state.
    // N/A

    // Common tests suite.
    commonTestsSuite(setup, { className: 'group', prop: 'group' }, { className: CLASSNAME });
});
