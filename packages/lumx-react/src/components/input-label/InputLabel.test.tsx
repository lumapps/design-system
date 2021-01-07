import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Theme } from '@lumx/react';
import { Wrapper } from '@lumx/react/testing/utils';
import { InputLabel, InputLabelProps } from './InputLabel';

const CLASSNAME = InputLabel.className as string;

type SetupProps = Partial<InputLabelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { htmlFor: 'id', ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<InputLabel {...props} />);
    const label: Wrapper = wrapper.find('.lumx-input-label');

    return { label, props, wrapper };
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
                htmlFor: '123',
            });
            expect(label).toContainReact(children);
            expect(label).toHaveProp('htmlFor', '123');
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
});
