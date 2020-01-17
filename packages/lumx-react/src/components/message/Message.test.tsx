import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { CLASSNAME, DEFAULT_PROPS, Message, MessageKind, MessageProps } from './Message';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<MessageProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;
    message: Wrapper;

    /**
     * [Enter the description of this wrapper].
     * [You should also probably change the name of the wrapper to something more meaningful].
     */
    wrapper: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
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

describe(`<${Message.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Here are some examples of basic props check.

        it('should use default props', (): void => {
            const { wrapper } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string): void => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
        });

        it('should use the given `kind`', (): void => {
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

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
