import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { Kind, Theme } from '@lumx/react';
import { Wrapper } from '@lumx/react/testing/utils';
import { InputHelper, InputHelperProps } from './InputHelper';

const CLASSNAME = InputHelper.className as string;

type SetupProps = Partial<InputHelperProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<InputHelper {...props} />);
    const helper: Wrapper = wrapper.find('.lumx-input-helper');

    return { helper, props, wrapper };
};

const properties = {
    error: {
        children: 'Error',
        kind: Kind.error,
    },
    info: {
        children: 'Info',
        kind: Kind.info,
    },
    success: {
        children: 'Success',
        kind: Kind.success,
    },
    warning: {
        children: 'Warning',
        kind: Kind.warning,
    },
};

describe(`<${InputHelper.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const children = 'The helper text';
            const { wrapper, helper } = setup({ children });

            expect(wrapper).toMatchSnapshot();
            expect(helper).toExist();
            expect(helper).toHaveClassName(CLASSNAME);
            expect(helper).toHaveClassName(`${CLASSNAME}--theme-light`);
            expect(helper).toHaveText(children);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should render info', () => {
            const { helper } = setup(properties.info);
            expect(helper).toHaveText(properties.info.children);
        });
        it('should render error', () => {
            const { helper } = setup(properties.error);
            expect(helper).toIncludeText(properties.error.children);
        });
        it('should render valid', () => {
            const { helper } = setup(properties.success);
            expect(helper).toIncludeText(properties.success.children);
        });
        it('should render warning', () => {
            const { helper } = setup(properties.warning);
            expect(helper).toIncludeText(properties.warning.children);
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
