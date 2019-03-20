import React, { Fragment } from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import { build, fake, oneOf } from 'test-data-bot';

import { LxIcon } from 'LumX';
import { ICommonSetup } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

import { LxButton, Variants } from './LxButton';
import { CLASSNAME, Emphasises, LxIconButton, LxIconButtonProps, Sizes, Themes } from './LxIconButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxIconButtonProps>;

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: ISetupProps;

    /**
     * The <LxButton> element that is used as a wrapper for the children of the <LxIconButton>.
     */
    button: ShallowWrapper;

    /**
     * The <LxIcon> icon(s) of the <LxIconButton>.
     */
    icon: ShallowWrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props The props to use to override the default props of the component.
 * @return {ISetup}            An object with the props, the component wrapper and some shortcut to some element inside of
 *                             the component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}): ISetup => {
    const props: LxIconButtonProps = {
        children: <LxIcon icon={mdiPlus} />,
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxIconButton {...props} />);

    return {
        button: wrapper.find('LxButton'),

        icon: wrapper.find('LxIcon'),

        props,
        wrapper,
    };
};

describe(`<${LxIconButton.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly an icon button', (): void => {
            const { button, icon, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(button.exists()).toEqual(true);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(icon.prop('className')).toContain(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { button }: ISetup = setup();

            expect(button.prop('variant')).toEqual(Variants.icon);
        });

        it("should user 'icon' `variant` whatever the given prop is", (): void => {
            // Disable the display of the warn message in the console.
            global.console.warn = jest.fn();

            const testedProp: string = 'variant';
            const modifiedProps: ISetupProps = {
                [testedProp]: Variants.icon,
            };

            let { button }: ISetup = setup(modifiedProps);

            expect(button.prop(testedProp)).toEqual(Variants.icon);

            /////////////////////////////

            modifiedProps[testedProp] = Variants.button;

            ({ button } = setup(modifiedProps));

            expect(button.prop(testedProp)).toEqual(Variants.icon);

            // @ts-ignore
            global.console.warn.mockRestore();
        });

        it(`should forward any <${LxButton.displayName}> prop (except \`variant\`)`, (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                color: fake((fakeData) => fakeData.commerce.color()),
                emphasis: oneOf(...Object.values(Emphasises)),
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();
            if (modifiedProps.emphasis !== Emphasises.high) {
                delete modifiedProps.theme;
            }
            const { button }: ISetup = setup(modifiedProps);

            Object.keys(modifiedProps).forEach((prop: string) => {
                expect(button.prop(prop)).toEqual(modifiedProps[prop]);
            });
        });

        it('should forward any CSS class', (): void => {
            const testedProp: string = 'className';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'component component--is-tested',
            };

            const { button }: ISetup = setup(modifiedProps);

            expect(button.prop(testedProp)).toContain(modifiedProps[testedProp]);
        });

        it('should forward any other props', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { button }: ISetup = setup(modifiedProps);

            expect(button.prop(testedProp)).toEqual(modifiedProps[testedProp]);
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
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than <${LxIcon.displayName}> is given as child`, (): void => {
            const children: React.ReactNode = <div>toto</div>;

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should warn the user when rendering a <${LxIconButton.displayName}> with a \`variant\``, (): void => {
            global.console.warn = jest.fn();

            // We know that a <LxIconButton> cannot receive a `variant`, but for the purpose of the test we ignore this.
            // @ts-ignore
            setup({ variant: Variants.icon });
            expect(global.console.warn).toHaveBeenCalled();

            // @ts-ignore
            global.console.warn.mockClear();

            // We know that a <LxIconButton> cannot receive a `variant`, but for the purpose of the test we ignore this.
            // @ts-ignore
            setup({ variant: Variants.button });
            expect(global.console.warn).toHaveBeenCalled();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
