import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { build, oneOf } from 'test-data-bot';

import without from 'lodash/without';

import { Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme, Alignment } from '@lumx/react';
import { Switch, SwitchProps } from './Switch';

const DEFAULT_PROPS = Switch.defaultProps as any;
const CLASSNAME = Switch.className as string;

type SetupProps = Partial<SwitchProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: SwitchProps = {
        ...propsOverride,
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

jest.mock('uid', () => ({ uid: () => 'uid' }));

describe(`<${Switch.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly without any label', () => {
            const { root, inputWrapper, input, content, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);

            expect(inputWrapper).toExist();
            expect(input).toExist();

            expect(content).not.toExist();
        });

        it('should render correctly with only a `label`', () => {
            const props: SetupProps = { children: 'Label' };
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

        it('should render correctly with a `label` and a `helper`', () => {
            const props: SetupProps = { children: 'Label', helper: 'Helper' };
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

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should use default props', () => {
            const { root } = setup();

            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                let defaultProp: any = DEFAULT_PROPS[prop];

                if (prop === 'checked') {
                    // eslint-disable-next-line no-param-reassign
                    prop = 'unchecked';
                    defaultProp = true;
                }

                expect(root).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: defaultProp }));
            });
        });

        it('should use the given props', () => {
            const modifiedPropsBuilder: () => SetupProps = build('props').fields({
                isChecked: true,
                position: oneOf(...without(Object.values(Alignment), DEFAULT_PROPS.position)),
                theme: oneOf(...without(Object.values(Theme), DEFAULT_PROPS.theme)),
            });

            const modifiedProps: SetupProps = modifiedPropsBuilder();

            const { root } = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach((prop: string) => {
                if (prop === 'checked') {
                    if (modifiedProps[prop]) {
                        expect(root).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
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

    // 3. Test events.
    describe('Events', () => {
        const onChange: jest.Mock = jest.fn();

        beforeEach(() => {
            onChange.mockClear();
        });

        it('should trigger `onChange` when toggled', () => {
            const { input } = setup({ onChange }, false);

            input.simulate('change');
            expect(onChange).toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should not display the `helper` if no `label` is given', () => {
            const props: SetupProps = { helper: 'Helper' };
            const { content, wrapper } = setup(props);
            expect(wrapper).toMatchSnapshot();

            expect(content).not.toExist();
        });
    });

    // 5. Test state.
    // N/A

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
