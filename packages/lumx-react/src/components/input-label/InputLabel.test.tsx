import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Theme } from '@lumx/react';
import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';
import { CLASSNAME, InputLabel, InputLabelProps } from './InputLabel';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<InputLabelProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <Portal> element that wraps inputLabel elements.
     */
    wrapper: Wrapper;

    /**
     * The element itselt
     */
    label: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                   The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: SetupProps = {}, shallowRendering: boolean = true): Setup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper: Wrapper = renderer(<InputLabel {...props} />);
    const label: Wrapper = wrapper.find('.lumx-input-label');

    return {
        label,
        props,
        wrapper,
    };
};

describe(`<${InputLabel.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const children = 'The Label text';
            const { wrapper, label } = setup({ children });

            expect(wrapper).toMatchSnapshot();
            expect(label).toExist();
            expect(label).toHaveClassName(CLASSNAME);
            expect(label).toHaveClassName(`${CLASSNAME}--theme-light`);
            expect(label).toHaveText(children);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should render children', () => {
            const children = (
                <span>
                    The label<strong>*</strong>
                </span>
            );

            const { label } = setup({
                children,
            });
            expect(label).toContainReact(children);
        });

        it('should add custom props', () => {
            const data = {
                children: 'The Label',
                htmlFor: 'toto',
            };

            const { label } = setup(data);
            expect(label).toHaveProp('htmlFor', data.htmlFor);
        });

        it('should render dark theme', () => {
            const { label } = setup({ children: 'The label', theme: Theme.dark });
            expect(label).toHaveClassName(CLASSNAME);
            expect(label).toHaveClassName(`${CLASSNAME}--theme-dark`);
        });

        it('should render custom className', () => {
            const className = 'my-class__test';
            const { label } = setup({ children: 'The label', className });
            expect(label).toHaveClassName(CLASSNAME);
            expect(label).toHaveClassName(className);
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
