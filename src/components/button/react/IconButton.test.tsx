import React from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import { Button, ButtonVariants } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { mdiChevronDown, mdiPlus } from 'LumX/icons';

import { CLASSNAME, Emphasises, IconButton, IconButtonProps, Sizes, Themes } from './IconButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<IconButtonProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <Button> element that is used as a wrapper for the children of the <IconButton>.
     */
    button: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of
 *                       the component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: IconButtonProps = {
        icon: mdiPlus,
        ...propsOverrides,
    };

    const renderer: (el: React.ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<IconButton {...props} />);

    return {
        button: wrapper.find('Button'),

        props,
        wrapper,
    };
};

describe(`<${IconButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly an icon button', (): void => {
            const { button, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);

            expect(button).toHaveProp('leftIcon');
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { button, props }: ISetup = setup();

            expect(button).toHaveProp('leftIcon', props.icon);
            expect(button).toHaveProp('variant', ButtonVariants.icon);
        });

        it("should use 'icon' `variant` whatever the given `variant` prop is", (): void => {
            mockConsole();

            const modifiedProps: ISetupProps = {
                // We known that <IconButton> could not have a `variant` prop.
                // @ts-ignore
                variant: ButtonVariants.icon,
            };

            let { button }: ISetup = setup(modifiedProps);

            expect(button).toHaveProp('variant', ButtonVariants.icon);

            /////////////////////////////

            // We known that <IconButton> could not have a `variant` prop.
            // @ts-ignore
            modifiedProps.variant = ButtonVariants.button;

            ({ button } = setup(modifiedProps));

            expect(button).toHaveProp('variant', ButtonVariants.icon);
        });

        it(`should forward any <${Button.displayName}> prop (except \`variant\`)`, (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                // tslint:disable-next-line: no-any
                color: fake((fakeData: any): string => fakeData.commerce.color()),
                emphasis: oneOf(...Object.values(Emphasises)),
                icon: oneOf(mdiPlus, mdiChevronDown),
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { button }: ISetup = setup(modifiedProps);

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'icon') {
                        return;
                    }

                    expect(button).toHaveProp(prop, modifiedProps[prop]);
                },
            );
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', (): void => {
        // Nothing to do here.
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

        it('should fail when any child is given', (): void => {
            expect(
                (): void => {
                    setup({ children: 'Label', icon: mdiPlus });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when no `icon` are given', (): void => {
            expect(
                (): void => {
                    setup({ icon: undefined });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when using `leftIcon` instead of `icon`', (): void => {
            expect(
                (): void => {
                    // @ts-ignore
                    setup({ leftIcon: mdiPlus });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when using `rightIcon` instead of `icon`', (): void => {
            expect(
                (): void => {
                    // @ts-ignore
                    setup({ rightIcon: mdiPlus });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should warn the user when rendering a <${IconButton.displayName}> with a \`variant\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <IconButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariants.icon });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <IconButton> cannot receive a `variant`, but for the purpose of the test ignore it.
            // @ts-ignore
            setup({ variant: ButtonVariants.button });
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
    commonTestsSuite(setup, { className: 'button', prop: 'button' }, { className: CLASSNAME });
});
