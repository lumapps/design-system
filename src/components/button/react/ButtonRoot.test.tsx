import React from 'react';

import { mount, shallow } from 'enzyme';

import { ICommonSetup, Wrapper } from 'LumX/core/testing/utils.test';

import { ButtonRoot, ButtonRootProps } from './ButtonRoot';

/////////////////////////////

/**
 * The URL to use as test URL.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const TEST_URL: string = 'https://www.lumapps.com';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<ButtonRootProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <a> element when the <Button> receives a `href` prop.
     */
    a: Wrapper;

    /**
     * The <button> element when the <Button> does not receives a `href` prop.
     */
    button: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props  The props to use to override the default props of the component.
 * @param  {boolean}     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: ButtonRootProps = {
        children: 'Label',
        ...propsOverrides,
    };

    const renderer: (el: React.ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<ButtonRoot {...props} />);

    return {
        a: wrapper.find('a'),
        button: wrapper.find('button'),

        props,
        wrapper,
    };
};

describe(`<${ButtonRoot.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly as a button', (): void => {
            const { a, button, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(a).not.toExist();
            expect(button).toExist();
        });

        it('should render correctly as a link', (): void => {
            const { a, button, wrapper }: ISetup = setup({ href: TEST_URL });
            expect(wrapper).toMatchSnapshot();

            expect(a).toExist();
            expect(button).not.toExist();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('can be disabled', (): void => {
            const modifiedProps: ISetupProps = {
                disabled: 'true',
            };

            const { button }: ISetup = setup(modifiedProps);

            expect(button).toBeDisabled();

            /////////////////////////////

            modifiedProps.href = TEST_URL;

            const { a }: ISetup = setup(modifiedProps);

            expect(a).toBeDisabled();
        });

        it('should use the given `href`', (): void => {
            const testedProp: string = 'href';
            const modifiedProps: ISetupProps = {
                [testedProp]: TEST_URL,
            };

            const { a }: ISetup = setup(modifiedProps);

            expect(a).toHaveProp(testedProp, modifiedProps[testedProp]);
        });

        it('should use the given `target`', (): void => {
            const testedProp: string = 'href';
            const modifiedProps: ISetupProps = {
                [testedProp]: '_blank',
                href: TEST_URL,
            };

            const { a }: ISetup = setup(modifiedProps);

            expect(a).toHaveProp(testedProp, modifiedProps[testedProp]);
        });

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { button }: ISetup = setup(modifiedProps);

            expect(button).toHaveClassName(modifiedProps.className);

            /////////////////////////////

            modifiedProps.href = TEST_URL;

            const { a }: ISetup = setup(modifiedProps);

            expect(a).toHaveClassName(modifiedProps.className);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { button }: ISetup = setup(modifiedProps);

            expect(button).toHaveProp(testedProp, modifiedProps[testedProp]);

            /////////////////////////////

            modifiedProps.href = TEST_URL;

            const { a }: ISetup = setup(modifiedProps);

            expect(a).toHaveProp(testedProp, modifiedProps[testedProp]);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onClick: jest.Mock = jest.fn();

        it('should trigger `onClick` when the button is clicked', (): void => {
            const { button }: ISetup = setup({ onClick });

            button.simulate('click');
            expect(onClick).toHaveBeenCalled();

            /////////////////////////////

            onClick.mockClear();

            const { a }: ISetup = setup({ href: TEST_URL, onClick });

            a.simulate('click');
            expect(onClick).toHaveBeenCalled();
        });
    });
    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        it('should fail when no child is given', (): void => {
            expect(
                (): void => {
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
