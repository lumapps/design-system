import React, { ReactElement, RefObject } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { CommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { CLASSNAME, DEFAULT_PROPS, Popover, PopoverProps } from './Popover';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<PopoverProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that holds the popover content.
     */
    popover: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const popoverRef = React.createRef();

    const props: PopoverProps = {
        // tslint:disable-next-line no-unused
        children: 'This is the content of the popover',
        isVisible: true,
        popoverRect: {
            height: 0,
            width: 0,
            x: 0,
            y: 0,
        },
        popoverRef: popoverRef as RefObject<HTMLDivElement>,
        ...propsOverrides,
    };

    /**
     * Here, we are mounting the component in order to retrieve the reference,
     * and use it to render the component.
     */
    mount(<Popover {...props} />);

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Popover {...props} />);

    return {
        popover: wrapper.find('div').first(),

        props,
        wrapper,
    };
};

describe(`<${Popover.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { popover, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(popover).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { wrapper, popover }: Setup = setup();
            wrapper.update();

            expect(popover).toHaveClassName(CLASSNAME);
            expect(popover).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'elevation', value: DEFAULT_PROPS.elevation }),
            );
        });
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should be displayed when isVisible is set to true', () => {
            const { popover } = setup({ isVisible: true });

            expect(popover.prop('style')).toHaveProperty('visibility', 'visible');
        });

        it('should be hidden when isVisible is set to false', () => {
            const { popover } = setup({ isVisible: false });

            expect(popover.prop('style')).toHaveProperty('visibility', 'hidden');
        });

        it('should be placed correctly by the popoverRect prop', () => {
            const popoverRect = { x: 300, y: 300, width: 500, height: 200 };
            const { popover } = setup({ popoverRect });

            expect(popover.prop('style')).toHaveProperty(
                'transform',
                `translate(${popoverRect.x}px, ${popoverRect.y}px)`,
            );
        });

        it('should be placed correctly by the popoverRect prop', () => {
            const { popover } = setup({ elevation: 7 });

            expect(popover).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'elevation', value: 5 }));
        });
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'popover', prop: 'popover' }, { className: CLASSNAME });
});
