import React, { ReactElement, ReactNode } from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import { Button, ButtonEmphasis, ButtonGroup, ButtonVariant, Icon, Size, Theme } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { mdiMenuDown, mdiPlus } from 'LumX/icons';

import { CLASSNAME, DropdownButton, DropdownButtonProps } from './DropdownButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<DropdownButtonProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <Button> element that is used as a wrapper for the children of the <DropdownButton>.
     */
    button: Wrapper;

    /**
     * The <Dropdown> element that holds the dropdown toggled by the <DropdownButton>.
     */
    dropdown: Wrapper;

    /**
     * The <ButtonGroup> element that is used as a wrapper for the buttons inside of the <DropdownButton> when
     * splitted.
     */
    group: Wrapper;

    /**
     * The <IconButton> that hold the dropdown toggle icon button.
     */
    iconButton: Wrapper;

    /**
     * The <Popover> element which is what is displayed within the Dropdown.
     */
    popover: Wrapper;

    /**
     * The root element of the <DropdownButton> component.
     * Either <ButtonGroup> if `splitted` or <Button> if not `splitted`.
     */
    root: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props                    The props to use to override the default props of the component.
 * @param  [shallowRendering=false] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of
 *         the component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = false,
): ISetup => {
    const props: DropdownButtonProps = {
        children: 'Label',
        dropdown: <span>Dropdown content</span>,
        ...propsOverrides,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DropdownButton {...props} />);

    return {
        root: props.splitted ? wrapper.find('ButtonGroup') : wrapper.find('Button'),

        group: wrapper.find('ButtonGroup'),

        button: wrapper.find('Button').first(),
        iconButton: wrapper.find('IconButton'),

        dropdown: wrapper.find('Dropdown'),
        popover: wrapper.find('Popover'),

        props,
        wrapper,
    };
};

describe(`<${DropdownButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a non-splitted dropdown button', (): void => {
            const { button, group, iconButton, popover, root, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(Button.displayName!);

            expect(group).not.toExist();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);
            expect(button).toHaveProp('rightIcon', mdiMenuDown);

            expect(iconButton).not.toExist();

            expect(popover).toExist();
            expect(popover.prop('isVisible')).toBe(false);
        });

        it('should render correctly a non-splitted dropdown button with a preceding icon', (): void => {
            const { button, group, iconButton, popover, root, wrapper }: ISetup = setup({ icon: mdiPlus });
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(Button.displayName!);

            expect(group).not.toExist();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);

            expect(button).toHaveProp('leftIcon', mdiPlus);
            expect(button).toHaveProp('rightIcon', mdiMenuDown);

            expect(iconButton).not.toExist();

            expect(popover).toExist();
            expect(popover.prop('isVisible')).toBe(false);
        });

        it('should render correctly a splitted dropdown button', (): void => {
            const { button, group, iconButton, popover, root, wrapper }: ISetup = setup({ splitted: true });
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(ButtonGroup.displayName!);

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(button).toExist();

            expect(iconButton).toExist();
            expect(iconButton).toHaveProp('icon', mdiMenuDown);

            expect(popover).toExist();
            expect(popover.prop('isVisible')).toBe(false);
        });

        it('should render correctly a splitted dropdown button with a preceding icon', (): void => {
            const { button, group, iconButton, popover, root, wrapper }: ISetup = setup({
                icon: mdiPlus,
                splitted: true,
            });
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(ButtonGroup.displayName!);

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(button).toExist();

            expect(button.first()).toHaveProp('leftIcon', mdiPlus);

            expect(iconButton).toExist();
            expect(iconButton).toHaveProp('icon', mdiMenuDown);

            expect(popover).toExist();
            expect(popover.prop('isVisible')).toBe(false);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { root } = setup();

            expect(root).toHaveDisplayName(Button.displayName!);
        });

        it("should use 'button' `variant` whatever the given `variant` prop is", (): void => {
            mockConsole();

            const testedProp = 'variant' as string;
            const modifiedProps: ISetupProps = {
                [testedProp]: ButtonVariant.button,
            };

            let { button } = setup(modifiedProps);
            expect(button).toHaveProp(testedProp, ButtonVariant.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariant.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, ButtonVariant.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariant.icon;

            ({ button } = setup({ ...modifiedProps, splitted: true }));

            expect(button).toHaveProp(testedProp, ButtonVariant.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariant.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, ButtonVariant.button);
        });

        it(`should forward any <${Button.displayName}> prop (except \`variant\`)`, (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                // tslint:disable-next-line: no-any
                color: fake((fakeData: any): string => fakeData.commerce.color()),
                emphasis: oneOf(...Object.values(ButtonEmphasis)),
                size: oneOf(...Object.values(Size)),
                theme: oneOf(...Object.values(Theme)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            let { button } = setup(modifiedProps);

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(button).toHaveProp(prop, modifiedProps[prop]);
                },
            );

            /////////////////////////////

            ({ button } = setup({ ...modifiedProps, splitted: true }));

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(button).toHaveProp(prop, modifiedProps[prop]);
                },
            );
        });

        it('should forward any other props', (): void => {
            const testedProp = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            let { button, iconButton } = setup(modifiedProps);

            expect(button).toHaveProp(testedProp, modifiedProps[testedProp]);

            /////////////////////////////

            ({ button, iconButton } = setup({ ...modifiedProps, splitted: true }));

            expect(button).toHaveProp(testedProp, modifiedProps[testedProp]);
            expect(iconButton).toHaveProp(testedProp, modifiedProps[testedProp]);
        });
    });

    /////////////////////////////

    // 3. Test events.
    xdescribe('Events', (): void => {
        const onClick: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onClick.mockClear();
            },
        );

        it('should both trigger `onClick` and toggle the dropdown when the button is clicked in non-splitted mode', (): void => {
            const setupReturn: ISetup = setup({ onClick });
            const { button, wrapper }: ISetup = setupReturn;
            let { popover }: ISetup = setupReturn;

            expect(popover.prop('isVisible')).toBe(false);

            button.simulate('click');
            popover = wrapper.find('Popover');

            expect(onClick).toHaveBeenCalled();
            expect(popover.prop('isVisible')).toBe(true);
        });

        it('should only trigger `onClick` when the label button is clicked in splitted mode', (): void => {
            const setupReturn: ISetup = setup({ splitted: true, onClick });
            const { button, wrapper }: ISetup = setupReturn;
            let { popover }: ISetup = setupReturn;

            expect(popover.prop('isVisible')).toBe(false);

            button.simulate('click');
            popover = wrapper.find('Popover');

            expect(onClick).toHaveBeenCalled();
            expect(popover.prop('isVisible')).toBe(false);
        });

        it('should only toggle the dropdown when the dropdown (icon) button is clicked in splitted mode', (): void => {
            const setupReturn: ISetup = setup({ splitted: true, onClick });
            const { iconButton, wrapper }: ISetup = setupReturn;
            let { popover }: ISetup = setupReturn;

            expect(popover.prop('isVisible')).toBe(false);

            iconButton.simulate('click');
            popover = wrapper.find('Popover');

            expect(onClick).not.toHaveBeenCalled();
            expect(popover.prop('isVisible')).toBe(true);
        });
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', (): void => {
        beforeEach(
            (): void => {
                try {
                    // If `console.warn` has been mocked at least one, this exists. So disable TS here.
                    // @ts-ignore
                    global.console.warn.mockRestore();
                } catch (exception) {
                    // Nothing to do here.
                }
            },
        );

        it('should fail when more than 2 children are given', (): void => {
            let children: ReactNode = (
                <>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                </>
            );

            expect(
                (): void => {
                    setup({ children }, true);
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                </>
            );

            expect(
                (): void => {
                    setup({ children, splitted: true }, true);
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                    <span>Label 2</span>
                </>
            );

            expect(
                (): void => {
                    setup({ children }, true);
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <>
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                    <span>Label 2</span>
                </>
            );

            expect(
                (): void => {
                    setup({ children, splitted: true }, true);
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when using `leftIcon` instead of `icon`', (): void => {
            expect(
                (): void => {
                    // @ts-ignore
                    setup({ leftIcon: mdiPlus }, true);
                },
            ).toThrow();
        });

        it(`should warn the user when rendering a <${DropdownButton.displayName}> with a \`rightIcon\``, (): void => {
            global.console.warn = jest.fn();

            // @ts-ignore
            setup({ rightIcon: mdiPlus });
            expect(global.console.warn).toHaveBeenCalled();
        });

        it(`should warn the user when rendering a <${DropdownButton.displayName}> with a \`variant\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <DropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariant.icon });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <DropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariant.button });
            expect(global.console.warn).toHaveBeenCalled();
        });

        it(`should warn the user when rendering a <${DropdownButton.displayName}> without a \`dropdown\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <DropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ dropdown: null });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <DropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ dropdown: null });
            expect(global.console.warn).toHaveBeenCalled();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'root' }, { className: CLASSNAME });
});
