import React, { ReactElement, ReactNode } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import mockConsole from 'jest-mock-console';
import { build, oneOf } from 'test-data-bot';

import without from 'lodash/without';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { CLASSNAME, DEFAULT_PROPS, Switch, SwitchPosition, SwitchProps } from './Switch';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<SwitchProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The main container.
     */
    root: Wrapper;

    /**
     * The wrapper of the hidden checkbox.
     */
    inputWrapper: Wrapper;

    /**
     * The hidden checkbox.
     */
    input: Wrapper;

    /**
     * The wrapper of the label and helper.
     */
    content: Wrapper;

    /**
     * The helper.
     */
    helper: Wrapper;

    /**
     * The label.
     */
    label: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: SwitchProps = {
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Switch {...props} />);

    return {
        root: wrapper.find('div').first(),

        input: wrapper.find('input'),
        inputWrapper: wrapper.find(`.${CLASSNAME}__input-wrapper`),

        content: wrapper.find(`.${CLASSNAME}__content`),
        helper: wrapper.find(`.${CLASSNAME}__helper`),
        label: wrapper.find(`.${CLASSNAME}__label`),

        props,
        wrapper,
    };
};

jest.mock('uuid/v4', (): (() => string) => (): string => 'a7b5d992-fe30-4d58-967a-89b8bb7e109c');
describe(`<${Switch.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly without any label', (): void => {
            const { root, inputWrapper, input, content, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).not.toExist();
        });

        it('should render correctly with only a `label`', (): void => {
            const props: ISetupProps = { children: 'Label' };
            const { root, inputWrapper, input, content, helper, label, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).toExist();
            expect(label).toExist();
            expect(helper).not.toExist();
        });

        it('should render correctly with a `label` and a `helper`', (): void => {
            const props: ISetupProps = { children: 'Label', helper: 'Helper' };
            const { root, inputWrapper, input, content, helper, label, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).toExist();
            expect(label).toExist();
            expect(helper).toExist();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { root } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string): void => {
                // tslint:disable-next-line: no-any
                let defaultProp: any = DEFAULT_PROPS[prop];

                if (prop === 'checked') {
                    prop = 'unchecked';
                    defaultProp = true;
                }

                expect(root).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: defaultProp }));
            });
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                checked: true,
                position: oneOf(...without(Object.values(SwitchPosition), DEFAULT_PROPS.position)),
                theme: oneOf(...without(Object.values(Theme), DEFAULT_PROPS.theme)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { root } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop: string): void => {
                if (prop === 'checked') {
                    if (modifiedProps[prop]) {
                        expect(root).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop]! }),
                        );
                    } else {
                        expect(root).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: 'unchecked', value: true }),
                        );
                    }
                } else {
                    expect(root).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                }
            });
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onToggle: jest.Mock = jest.fn();

        beforeEach((): void => {
            onToggle.mockClear();
        });

        it('should trigger `onToggle` when toggled', (): void => {
            const { input } = setup({ onToggle }, false);

            input.simulate('change');
            expect(onToggle).toHaveBeenCalled();
        });
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        it('should fail when more than one child is given', (): void => {
            const children: ReactNode = (
                <>
                    Label
                    <span>Label 2</span>
                </>
            );

            expect((): void => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it('should fail when anything else than a text or a <span> is given', (): void => {
            mockConsole('debug');

            const children: ReactNode = <div>Label</div>;

            expect((): void => {
                setup({ children });
            }).toThrowErrorMatchingSnapshot();
        });

        it('should not display the `helper` if no `label` is given', (): void => {
            const props: ISetupProps = { helper: 'Helper' };
            const { content, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(content).not.toExist();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
