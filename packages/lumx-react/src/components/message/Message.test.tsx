import { CommonSetup, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { Message, MessageKind, MessageProps } from './Message';

const DEFAULT_PROPS = Message.defaultProps as any;
const CLASSNAME = Message.className as string;

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<MessageProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;
    message: Wrapper;
    wrapper: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true): Setup => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(
        <Message {...props}>
            <span>Lorem Ipsum</span>
        </Message>,
    );
    const message: Wrapper = wrapper.find('div').first();

    return {
        message,
        props,
        wrapper,
    };
};

describe(`<${Message.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { wrapper } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should use the given `kind`', () => {
            const testedProp = 'kind';
            const modifiedProps: Partial<MessageProps> = {
                [testedProp]: MessageKind.success,
            };

            const { message } = setup(modifiedProps);

            expect(message).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'color', value: `green` }));
            expect(message).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: DEFAULT_PROPS[testedProp] }),
            );
        });
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
