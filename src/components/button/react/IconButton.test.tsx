import React, { Fragment } from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import { Button, ButtonVariants, Icon } from 'LumX';
import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME as BUTTON_CLASSNAME } from './Button';
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

    /**
     * The <Icon> icon(s) of the <IconButton>.
     */
    icon: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props The props to use to override the default props of the component.
 * @param  {boolean}     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of
 *                       the component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: IconButtonProps = {
        children: <Icon icon={mdiPlus} />,
        ...propsOverrides,
    };

    const renderer: (el: React.ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<IconButton {...props} />);

    return {
        button: wrapper.find('Button'),

        icon: wrapper.find('Icon'),

        props,
        wrapper,
    };
};

describe(`<${IconButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly an icon button', (): void => {
            const { button, icon, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(button).toExist();
            expect(button).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon).toHaveClassName(`${BUTTON_CLASSNAME}__icon`);

            expect(icon.length).toEqual(1);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { button }: ISetup = setup();

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
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { button }: ISetup = setup(modifiedProps);

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
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

        it('should fail when no child is given', (): void => {
            expect(
                (): void => {
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it('should fail when more than 1 children are given', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <Icon icon={mdiPlus} />
                    <Icon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than <${Icon.displayName}> is given as child`, (): void => {
            mockConsole('debug');

            const children: React.ReactNode = <div>Label</div>;

            expect(
                (): void => {
                    setup({ children });
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
