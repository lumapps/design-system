import React, { Fragment } from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import { Button, ButtonGroup, ButtonVariants, Icon } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME, DropdownButton, DropdownButtonProps, Emphasises, Sizes, Themes } from './DropdownButton';

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
     * The <Icon>(s) that holds either the preceding icon (the one before the label) or the dropdown toggle icon.
     */
    icon: Wrapper;

    /**
     * The <IconButton> that hold the dropdown toggle icon button.
     */
    iconButton: Wrapper;

    /**
     * The roo element of the <DropdownButton> component.
     * Either <ButtonGroup> if `isSplitted` or <Button> if not `isSplitted`.
     */
    root: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props                   The props to use to override the default props of the component.
 * @param  {boolean}     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of
 *                       the component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: DropdownButtonProps = {
        children: 'Label',
        dropdown: <span>Dropdown content</span>,
        ...propsOverrides,
    };

    const renderer: (el: JSX.Element) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<DropdownButton {...props} />);

    return {
        root: props.isSplitted ? wrapper.find('ButtonGroup') : wrapper.find('Button'),

        group: wrapper.find('ButtonGroup'),

        button: wrapper.find('Button'),
        icon: wrapper.find('Icon'),
        iconButton: wrapper.find('IconButton'),

        dropdown: wrapper.find('Dropdown'),

        props,
        wrapper,
    };
};

describe(`<${DropdownButton.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a non-splitted dropdown button', (): void => {
            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            // tslint:disable-next-line: no-non-null-assertion
            expect(root).toHaveDisplayName(Button.displayName!);

            expect(group).not.toExist();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);

            expect(iconButton).not.toExist();

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(dropdown).not.toExist();
        });

        it('should render correctly a non-splitted dropdown button with a preceding icon', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            // tslint:disable-next-line: no-non-null-assertion
            expect(root).toHaveDisplayName(Button.displayName!);

            expect(group).not.toExist();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);

            expect(iconButton).not.toExist();

            expect(icon).toExist();
            expect(icon.length).toEqual(2);

            expect(dropdown).not.toExist();
        });

        it('should render correctly a splitted dropdown button', (): void => {
            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup({ isSplitted: true });
            expect(wrapper).toMatchSnapshot();

            // tslint:disable-next-line: no-non-null-assertion
            expect(root).toHaveDisplayName(ButtonGroup.displayName!);

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(button).toExist();
            expect(iconButton).toExist();
            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(dropdown).not.toExist();
        });

        it('should render correctly a splitted dropdown button with a preceding icon', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup({
                children,
                isSplitted: true,
            });
            expect(wrapper).toMatchSnapshot();

            // tslint:disable-next-line: no-non-null-assertion
            expect(root).toHaveDisplayName(ButtonGroup.displayName!);

            expect(group).toExist();
            expect(group).toHaveClassName(CLASSNAME);

            expect(button).toExist();
            expect(iconButton).toExist();
            expect(icon).toExist();
            expect(icon.length).toEqual(2);

            expect(dropdown).not.toExist();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { root }: ISetup = setup();

            // tslint:disable-next-line: no-non-null-assertion
            expect(root).toHaveDisplayName(Button.displayName!);
        });

        it("should use 'button' `variant` whatever the given `variant` prop is", (): void => {
            mockConsole();

            const testedProp: string = 'variant';
            const modifiedProps: ISetupProps = {
                [testedProp]: ButtonVariants.button,
            };

            let { button }: ISetup = setup(modifiedProps);
            expect(button).toHaveProp(testedProp, ButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariants.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, ButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariants.icon;

            ({ button } = setup({ ...modifiedProps, isSplitted: true }));

            expect(button).toHaveProp(testedProp, ButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = ButtonVariants.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, ButtonVariants.button);
        });

        it(`should forward any <${Button.displayName}> prop (except \`variant\`)`, (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                // tslint:disable-next-line: no-any
                color: fake((fakeData: any) => fakeData.commerce.color()),
                emphasis: oneOf(...Object.values(Emphasises)),
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            let { button }: ISetup = setup(modifiedProps);

            Object.keys(modifiedProps).forEach((prop: string) => {
                expect(button).toHaveProp(prop, modifiedProps[prop]);
            });

            /////////////////////////////

            ({ button } = setup({ ...modifiedProps, isSplitted: true }));

            Object.keys(modifiedProps).forEach((prop: string) => {
                expect(button).toHaveProp(prop, modifiedProps[prop]);
            });
        });

        it('should forward any other props', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            let { button, iconButton }: ISetup = setup(modifiedProps);

            expect(button).toHaveProp(testedProp, modifiedProps[testedProp]);

            /////////////////////////////

            ({ button, iconButton } = setup({ ...modifiedProps, isSplitted: true }));

            expect(button).toHaveProp(testedProp, modifiedProps[testedProp]);
            expect(iconButton).toHaveProp(testedProp, modifiedProps[testedProp]);
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        const onClick: jest.Mock = jest.fn();

        beforeEach(
            (): void => {
                onClick.mockClear();
            },
        );

        it('should both trigger `onClick` and toggle the dropdown when the button is clicked in non-splitted mode', () => {
            const setupReturn: ISetup = setup({ onClick }, false);
            const { button, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            button.simulate('click');
            dropdown = wrapper.find('Dropdown');

            expect(onClick).toHaveBeenCalled();
            expect(wrapper.find('Dropdown')).toExist();
        });

        it('should only trigger `onClick` when the label button is clicked in splitted mode', () => {
            const setupReturn: ISetup = setup({ isSplitted: true, onClick }, false);
            const { button, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            button.first().simulate('click');
            dropdown = wrapper.find('Dropdown');

            expect(onClick).toHaveBeenCalled();
            expect(wrapper.find('Dropdown')).not.toExist();
        });

        it('should only toggle the dropdown when the dropdown (icon) button is clicked in splitted mode', () => {
            const setupReturn: ISetup = setup({ isSplitted: true, onClick }, false);
            const { iconButton, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            iconButton.simulate('click');
            dropdown = wrapper.find('Dropdown');

            expect(onClick).not.toHaveBeenCalled();
            expect(wrapper.find('Dropdown')).toExist();
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
            let children: React.ReactNode = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children, isSplitted: true });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                    <span>Label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();

            /////////////////////////////

            children = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <span>Label</span>
                    <span>Label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children, isSplitted: true });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should warn the user when rendering a <${DropdownButton.displayName}> with a \`variant\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <DropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariants.icon });
            // tslint:disable-next-line: no-unbound-method
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <DropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariants.button });
            // tslint:disable-next-line: no-unbound-method
            expect(global.console.warn).toHaveBeenCalled();
        });

        it(`should warn the user when rendering a <${DropdownButton.displayName}> without a \`dropdown\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <DropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
            // @ts-ignore
            // tslint:disable-next-line: no-null-keyword
            setup({ dropdown: null });
            // tslint:disable-next-line: no-unbound-method
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <DropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
            // @ts-ignore
            // tslint:disable-next-line: no-null-keyword
            setup({ dropdown: null });
            // tslint:disable-next-line: no-unbound-method
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
