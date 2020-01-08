import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Kind, Theme } from '@lumx/react';
import { ICommonSetup, Wrapper } from '@lumx/react/testing/utils';
import { CLASSNAME, IInputHelperProps, InputHelper } from './InputHelper';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<IInputHelperProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <Portal> element that wraps inputHelper elements.
     */
    wrapper: Wrapper;

    /**
     * The element itselt
     */
    helper: Wrapper;

    /**
     * The element that wraps the <icon> element.
     */
    icon?: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<InputHelper {...props} />);
    const helper: Wrapper = wrapper.find('.lumx-input-helper');
    const icon: Wrapper = wrapper.find('Icon').first();

    return {
        helper,
        icon,
        props,
        wrapper,
    };
};

const properties = {
    error: {
        kind: Kind.error,
        text: 'Error',
    },
    info: {
        kind: Kind.info,
        text: 'Info',
    },
    valid: {
        kind: Kind.valid,
        text: 'Success',
    },
    warning: {
        kind: Kind.warning,
        text: 'Warning',
    },
};

describe(`<${InputHelper.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const text = 'The helper text';
            const { wrapper, helper, icon } = setup({ text });

            expect(wrapper).toMatchSnapshot();
            expect(helper).toExist();
            expect(icon).toHaveLength(0);
            expect(helper).toHaveClassName(CLASSNAME);
            expect(helper).toHaveClassName(`${CLASSNAME}--theme-light`);
            expect(helper).toHaveText(text);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should render info', () => {
            const { helper, icon } = setup(properties.info);
            expect(icon).toHaveLength(0);
            expect(helper).toHaveText(properties.info.text);
        });
        it('should render error', () => {
            const { helper, icon } = setup(properties.error);
            expect(icon).toHaveLength(1);
            expect(helper).toIncludeText(properties.error.text);
        });
        it('should render valid', () => {
            const { helper, icon } = setup(properties.valid);
            expect(icon).toHaveLength(1);
            expect(helper).toIncludeText(properties.valid.text);
        });
        it('should render warning', () => {
            const { helper, icon } = setup(properties.warning);
            expect(icon).toHaveLength(1);
            expect(helper).toIncludeText(properties.warning.text);
        });

        it('should render dark theme', () => {
            const { helper } = setup({ ...properties.info, theme: Theme.dark });
            expect(helper).toHaveClassName(CLASSNAME);
            expect(helper).toHaveClassName(`${CLASSNAME}--theme-dark`);
        });

        it('should render custom className', () => {
            const className = 'my-class__test';
            const { helper } = setup({ ...properties.info, className });
            expect(helper).toHaveClassName(CLASSNAME);
            expect(helper).toHaveClassName(className);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////
});
