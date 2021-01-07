import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Theme } from '@lumx/react';
import { ExpansionPanel, ExpansionPanelProps } from './ExpansionPanel';

const DEFAULT_PROPS = ExpansionPanel.defaultProps as any;
const CLASSNAME = ExpansionPanel.className as string;

type SetupProps = Partial<ExpansionPanelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: SetupProps = {}, shallowRendering = true) => {
    const props: ExpansionPanelProps = {
        toggleButtonProps: { label: 'Toggle' },
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<ExpansionPanel {...props} />);

    return {
        content: wrapper.find(`.${CLASSNAME}__wrapper`),
        header: wrapper.find(`.${CLASSNAME}__header`),
        label: wrapper.find(`.${CLASSNAME}__label`),
        props,
        root: wrapper.find('section'),
        wrapper,
    };
};

describe(`<${ExpansionPanel.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { root, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { root } = setup();

            for (const prop of Object.keys(DEFAULT_PROPS)) {
                expect(root).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            }
        });

        it('should ignore incorrect theme', () => {
            const { root } = setup({ theme: 'not_a_valid_theme' as Theme });

            // Correct classes are applied
            root.hasClass('lumx-color-background-dark-L6');
            root.hasClass('lumx-expansion-panel--theme-light');
            root.hasClass('lumx-color-font-dark-N');
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onOpen: jest.Mock = jest.fn();
        const onClose: jest.Mock = jest.fn();
        const onToggleOpen: jest.Mock = jest.fn();

        beforeEach(onOpen.mockClear);
        beforeEach(onClose.mockClear);
        beforeEach(onToggleOpen.mockClear);

        it('should trigger `onOpen`', () => {
            const { header } = setup({ onOpen }, false);
            header.simulate('click');
            expect(onOpen).toHaveBeenCalled();
        });

        it('should trigger `onClose`', () => {
            const { header } = setup({ isOpen: true, onClose }, false);
            header.simulate('click');
            expect(onClose).toHaveBeenCalled();
        });

        it('should trigger `onToggleOpen`', () => {
            const { header } = setup({ onToggleOpen }, false);
            header.simulate('click');
            header.simulate('click');
            expect(onToggleOpen).toHaveBeenCalledTimes(2);
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Here is an example of children types check.

        it('should hide content when `isOpen` == false', () => {
            const { content } = setup({ isOpen: false });

            expect(content.exists()).toBe(false);
        });

        it('should show content when `isOpen` == true', () => {
            const { content } = setup({ isOpen: true });

            expect(content.exists()).toBe(true);
        });

        it('should show label', () => {
            const labelText = 'Label text';
            const { header } = setup({ label: labelText });

            expect(header.text()).toContain(labelText);
        });

        it('should show header instead of label', () => {
            const labelText = 'Label text';
            const headerText = 'Header text';
            const { header } = setup({ label: labelText, children: <header>{headerText}</header> });

            expect(header.text()).toContain(headerText);
        });
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root', prop: 'root' }, { className: CLASSNAME });
});
