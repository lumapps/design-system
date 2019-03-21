import React, { Fragment } from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import { LxButton, LxButtonGroup, LxButtonVariants, LxIcon } from 'LumX';
import { ICommonSetup, Wrapper } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME, Emphasises, LxDropdownButton, LxDropdownButtonProps, Sizes, Themes } from './DropdownButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxDropdownButtonProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <LxButton> element that is used as a wrapper for the children of the <LxDropdownButton>.
     */
    button: Wrapper;

    /**
     * The <LxDropdown> element that holds the dropdown toggled by the <LxDropdownButton>.
     */
    dropdown: Wrapper;

    /**
     * The <LxButtonGroup> element that is used as a wrapper for the buttons inside of the <LxDropdownButton> when
     * splitted.
     */
    group: Wrapper;

    /**
     * The <LxIcon>(s) that holds either the preceding icon (the one before the label) or the dropdown toggle icon.
     */
    icon: Wrapper;

    /**
     * The <LxIconButton> that hold the dropdown toggle icon button.
     */
    iconButton: Wrapper;

    /**
     * The roo element of the <LxDropdownButton> component.
     * Either <LxButtonGroup> if `isSplitted` or <LxButton> if not `isSplitted`.
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
const setup = ({ ...propsOverrides }: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const props: LxDropdownButtonProps = {
        children: 'Label',
        dropdown: <span>Dropdown content</span>,
        ...propsOverrides,
    };

    const renderer: (el: JSX.Element) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<LxDropdownButton {...props} />);

    return {
        root: props.isSplitted ? wrapper.find('LxButtonGroup') : wrapper.find('LxButton'),

        group: wrapper.find('LxButtonGroup'),

        button: wrapper.find('LxButton'),
        icon: wrapper.find('LxIcon'),
        iconButton: wrapper.find('LxIconButton'),

        dropdown: wrapper.find('LxDropdown'),

        props,
        wrapper,
    };
};

describe(`<${LxDropdownButton.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a non-splitted dropdown button', (): void => {
            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(LxButton.displayName!);

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
                    <LxIcon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(LxButton.displayName!);

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

            expect(root).toHaveDisplayName(LxButtonGroup.displayName!);

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
                    <LxIcon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { button, dropdown, group, icon, iconButton, root, wrapper }: ISetup = setup({
                children,
                isSplitted: true,
            });
            expect(wrapper).toMatchSnapshot();

            expect(root).toHaveDisplayName(LxButtonGroup.displayName!);

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

            expect(root).toHaveDisplayName(LxButton.displayName!);
        });

        it("should use 'button' `variant` whatever the given `variant` prop is", (): void => {
            mockConsole();

            const testedProp: string = 'variant';
            const modifiedProps: ISetupProps = {
                [testedProp]: LxButtonVariants.button,
            };

            let { button }: ISetup = setup(modifiedProps);
            expect(button).toHaveProp(testedProp, LxButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = LxButtonVariants.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, LxButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = LxButtonVariants.icon;

            ({ button } = setup({ ...modifiedProps, isSplitted: true }));

            expect(button).toHaveProp(testedProp, LxButtonVariants.button);

            /////////////////////////////

            modifiedProps[testedProp] = LxButtonVariants.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp(testedProp, LxButtonVariants.button);
        });

        it(`should forward any <${LxButton.displayName}> prop (except \`variant\`)`, (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                color: fake((fakeData) => fakeData.commerce.color()),
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

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { root }: ISetup = setup(modifiedProps);

            expect(root).toHaveClassName(CLASSNAME);
            expect(root).toHaveClassName(modifiedProps.className);
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
        const onClick = jest.fn();

        beforeEach(
            (): void => {
                onClick.mockClear();
            },
        );

        it('should both trigger `onClick` and toggle the dropdown when the button is clicked in non-splitted mode', () => {
            const setupReturn: ISetup = setup(
                {
                    onClick,
                },
                false,
            );
            const { button, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            button.simulate('click');
            dropdown = wrapper.find('LxDropdown');

            expect(onClick).toHaveBeenCalled();
            expect(wrapper.find('LxDropdown')).toExist();
        });

        it('should only trigger `onClick` when the label button is clicked in splitted mode', () => {
            const setupReturn: ISetup = setup(
                {
                    isSplitted: true,
                    onClick,
                },
                false,
            );
            const { button, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            button.first().simulate('click');
            dropdown = wrapper.find('LxDropdown');

            expect(onClick).toHaveBeenCalled();
            expect(wrapper.find('LxDropdown')).not.toExist();
        });

        it('should only toggle the dropdown when the dropdown (icon) button is clicked in splitted mode', () => {
            const setupReturn: ISetup = setup(
                {
                    isSplitted: true,
                    onClick,
                },
                false,
            );
            const { iconButton, wrapper }: ISetup = setupReturn;
            let { dropdown }: ISetup = setupReturn;

            expect(dropdown).not.toExist();

            iconButton.simulate('click');
            dropdown = wrapper.find('LxDropdown');

            expect(onClick).not.toHaveBeenCalled();
            expect(wrapper.find('LxDropdown')).toExist();
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
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
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
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
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
                    <LxIcon icon={mdiPlus} />
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
                    <LxIcon icon={mdiPlus} />
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

        it(`should warn the user when rendering a <${LxDropdownButton.displayName}> with a \`variant\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <LxDropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: LxButtonVariants.icon });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <LxDropdownButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: LxButtonVariants.button });
            expect(global.console.warn).toHaveBeenCalled();
        });

        it(`should warn the user when rendering a <${
            LxDropdownButton.displayName
        }> without a \`dropdown\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <LxDropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ dropdown: null });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <LxDropdownButton> must receive a `dropdown`, but for the purpose of the test ignore it.
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
});
