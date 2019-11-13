// tslint:disable-next-line:no-unused
import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { Theme } from 'LumX';
import { CLASSNAME, DEFAULT_PROPS, ExpansionPanel, ExpansionPanelProps } from './ExpansionPanel';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<ExpansionPanelProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    root: Wrapper;
    header: Wrapper;
    label: Wrapper;
    content: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                    The props to use to override the default props of the component.
 * @param  [shallowRendering=true]  Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: ExpansionPanelProps = {
        ...propsOverrides,
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

describe(`<${ExpansionPanel.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', (): void => {
            const { root, wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toExist();
            expect(root).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        // Here are some examples of basic props check.

        it('should use default props', (): void => {
            const { root } = setup();

            for (const prop of Object.keys(DEFAULT_PROPS)) {
                expect(root).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            }
        });

        it('should ignore incorrect theme', (): void => {
            const { root } = setup({ theme: 'not_a_valid_theme' as Theme });

            // Correct classes are applied
            root.hasClass('lumx-theme-background-dark-L6');
            root.hasClass('lumx-expansion-panel--theme-light');
            root.hasClass('lumx-theme-color-dark-N');
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const openCallback: jest.Mock = jest.fn();
        const closeCallback: jest.Mock = jest.fn();
        const toggleCallback: jest.Mock = jest.fn();

        beforeEach(openCallback.mockClear);
        beforeEach(closeCallback.mockClear);
        beforeEach(toggleCallback.mockClear);

        it('should trigger `openCallback`', (): void => {
            const { header } = setup({ openCallback }, false);
            header.simulate('click');
            expect(openCallback).toHaveBeenCalled();
        });

        it('should trigger `closeCallback`', (): void => {
            const { header } = setup({ isOpen: true, closeCallback }, false);
            header.simulate('click');
            expect(closeCallback).toHaveBeenCalled();
        });

        it('should trigger `toggleCallback`', (): void => {
            const { header } = setup({ toggleCallback }, false);
            header.simulate('click');
            header.simulate('click');
            expect(toggleCallback).toHaveBeenCalledTimes(2);
        });
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        // Here is an example of children types check.

        it('should hide content when `isOpen` == false', (): void => {
            const { content } = setup({ isOpen: false });

            expect(content).toBeEmptyObject();
        });

        it('should show content when `isOpen` == true', (): void => {
            const { content } = setup({ isOpen: true });

            expect(content).toBeTruthy();
        });

        it('should show label', (): void => {
            const labelText = 'Label text';
            const { header } = setup({ label: labelText });

            expect(header.text()).toStartWith(labelText);
        });

        it('should show header instead of label', (): void => {
            const labelText = 'Label text';
            const headerText = 'Header text';
            const { header } = setup({ label: labelText, children: [<header>{headerText}</header>] });

            expect(header.text()).toStartWith(headerText);
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
