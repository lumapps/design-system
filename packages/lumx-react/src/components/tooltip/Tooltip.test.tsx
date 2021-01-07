import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { Button, Icon } from '@lumx/react';
import { Tooltip, TooltipProps } from './Tooltip';

const CLASSNAME = Tooltip.className as string;

jest.mock('uid', () => ({ uid: () => 'uid' }));

type SetupProps = Partial<TooltipProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(
        <Tooltip label="Tooltip" {...props}>
            Anchor
        </Tooltip>,
    );
    const tooltip = wrapper.find(`.${CLASSNAME}`);

    return {
        props,
        tooltip,
        wrapper,
    };
};

jest.mock('./useTooltipOpen', () => ({ useTooltipOpen: () => true }));

describe(`<${Tooltip.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { tooltip, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(tooltip).toExist();
            expect(tooltip).toHaveClassName(CLASSNAME);
        });

        it('should return children when empty label', () => {
            const wrapper = shallow(
                <Tooltip label="">
                    <Icon icon="icon" />
                </Tooltip>,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should wrap children', () => {
            // Wrap string children
            const wrapper1 = shallow(<Tooltip label="tooltip1">children</Tooltip>);
            expect(wrapper1).toMatchSnapshot();

            // Wrap fragment children
            const wrapper2 = shallow(
                <Tooltip label="tooltip1">
                    <>children</>
                </Tooltip>,
            );
            expect(wrapper2).toMatchSnapshot();
        });

        it('should not wrap Icon', () => {
            const wrapper = shallow(
                <Tooltip label="tooltip1">
                    <Icon icon="icon" />
                </Tooltip>,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should not wrap Button', () => {
            const wrapper = shallow(
                <Tooltip label="tooltip1">
                    <Button>button</Button>
                </Tooltip>,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should work on disabled elements', () => {
            const wrapper = shallow(
                <Tooltip label="Tooltip on disabled button" forceOpen>
                    <Button isDisabled>Empty</Button>
                </Tooltip>,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'tooltip', prop: 'tooltip' }, { className: CLASSNAME });
});
