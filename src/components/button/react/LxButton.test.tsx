import { ICommonSetup } from 'LumX/core/testing/utils.test';

/////////////////////////////

import React, { Fragment } from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import { build, fake, oneOf } from 'test-data-bot';

import get from 'lodash/get';

import { LxIcon } from 'LumX';
import { getBasicClass } from 'LumX/core/utils';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME, DEFAULT_PROPS, Emphasises, LxButton, LxButtonProps, Sizes, Themes, Variants } from './LxButton';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxButtonProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <LxButtonRoot> element that is used as a wrapper for the children of the <LxButton>.
     */
    buttonRoot: ShallowWrapper;

    /**
     * The <LxIcon> icon(s) of the <LxButton> (can have 0, 1 or 2).
     */
    icon: ShallowWrapper;

    /**
     * The <span> element of label of the <LxButton> (can have 0 or 1).
     */
    label: ShallowWrapper;
}

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Get the default value of the given prop of a <LxButton>, depending on the effective props of the component (some
 * default value depends on the value of another prop).
 *
 * @param {string}      prop  The name of the prop you want the default value of.
 * @param {ISetupProps} props The current props of the <LxButton>.
 */
function _getDefaultPropValue({ prop, props }: { prop: string; props?: ISetupProps }): string {
    return prop === 'color'
        ? DEFAULT_PROPS[prop][`emphasis-${get(props, 'emphasis', DEFAULT_PROPS.emphasis)}`] ||
              DEFAULT_PROPS[prop].default
        : DEFAULT_PROPS[prop];
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {ISetupProps} props  The props to use to override the default props of the component.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...propsOverrides }: ISetupProps = {}): ISetup => {
    const props: LxButtonProps = {
        children: 'Label',
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxButton {...props} />);

    return {
        buttonRoot: wrapper.find('LxButtonRoot'),

        icon: wrapper.find('LxIcon'),
        label: wrapper.find('span'),

        props,
        wrapper,
    };
};

describe(`<${LxButton.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a text label', (): void => {
            const { buttonRoot, icon, label, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(false);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly a <span> label', (): void => {
            const children: React.ReactNode = <span>Label</span>;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(false);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly an icon and a text label', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly an icon and a <span> label', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>Label</span>
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly a text label and an icon', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    Label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly a <span> label and an icon', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <span>Label</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly two icons and a text label', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    Label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(2);
            expect(label.exists()).toEqual(true);
        });

        it('should render correctly two icons and a <span> label', (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>Label</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(2);
            expect(label.exists()).toEqual(true);
        });

        it("should render correctly an icon button with the 'button' `variant`", (): void => {
            // Disable the display of the warn message in the console.
            global.console.warn = jest.fn();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(false);

            // @ts-ignore
            global.console.warn.mockRestore();
        });

        it("should render correctly an icon button with the 'icon' `variant`", (): void => {
            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children, variant: Variants.icon });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot.prop('className')).toContain(CLASSNAME);
            expect(icon.exists()).toEqual(true);
            expect(icon.length).toEqual(1);
            expect(label.exists()).toEqual(false);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { buttonRoot }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    expect(
                        buttonRoot.hasClass(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: _getDefaultPropValue({ prop }) }),
                        ),
                    ).toEqual(true);
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                color: fake((fakeData) => fakeData.commerce.color()),
                emphasis: oneOf(...Object.values(Emphasises)),
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
                variant: oneOf(...Object.values(Variants)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();
            if (modifiedProps.emphasis !== Emphasises.high) {
                delete modifiedProps.theme;
            }
            const children = modifiedProps.variant === Variants.icon ? <LxIcon icon="mdiPlus" /> : 'Label';

            const { buttonRoot }: ISetup = setup({ children, ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(
                        buttonRoot.hasClass(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                        ),
                    ).toEqual(true);
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

        it("should fail when more than 3 children are given in the 'button' `variant`", (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <span>label</span>
                    <span>label 2</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                    // @ts-ignore
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a text, <span> or <${
            LxIcon.displayName
        }> is given as child in the 'button' \`variant\``, (): void => {
            const children: React.ReactNode = <div>toto</div>;

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 1 text or <span> child is given in the 'button' `variant`", (): void => {
            let children: React.ReactNode = (
                <Fragment>
                    <span>label</span>
                    label 2
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
                    <span>label</span>
                    <span>label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
                    // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                    // @ts-ignore
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when there are 2 or more <${
            LxIcon.displayName
        }> in a row in the 'button' \`variant\``, (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                    // @ts-ignore
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 1 child is given in the 'icon' `variant`", (): void => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    // We know that children is mandatory, but we want to test the error validation. So disable TS here.
                    // @ts-ignore
                    setup({ children, variant: Variants.icon });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a <${
            LxIcon.displayName
        }> is given as child in the 'icon' \`variant\``, (): void => {
            expect(
                (): void => {
                    setup({ variant: Variants.icon });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should warn the user when rendering an icon button with the 'button' `variant`", (): void => {
            global.console.warn = jest.fn();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            setup({ children });
            expect(global.console.warn).toHaveBeenCalled();
        });

        it("should not warn the user when rendering an icon button with the 'icon' `variant`", (): void => {
            global.console.warn = jest.fn();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            setup({ children, variant: Variants.icon });
            expect(global.console.warn).not.toHaveBeenCalled();
        });

        it("should have no `theme` in any other `emphasis` than 'high'", (): void => {
            let modifiedProps: ISetupProps = {
                emphasis: Emphasises.high,
            };

            let { buttonRoot }: ISetup = setup(modifiedProps);
            expect(
                buttonRoot.hasClass(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme })),
            ).toEqual(true);

            /////////////////////////////

            modifiedProps = {
                emphasis: Emphasises.medium,
            };

            ({ buttonRoot } = setup(modifiedProps));
            expect(
                buttonRoot.hasClass(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme })),
            ).toEqual(false);

            /////////////////////////////

            modifiedProps = {
                emphasis: Emphasises.low,
            };

            ({ buttonRoot } = setup(modifiedProps));
            expect(
                buttonRoot.hasClass(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme })),
            ).toEqual(false);
        });

        it('should only have the "left-icon" CSS class when an icon is passed as first child of a \'button\' `variant`', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { buttonRoot }: ISetup = setup({ children });
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-left-icon`)).toEqual(true);
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-right-icon`)).toEqual(false);
        });

        it('should only have the "right-icon" CSS class when an icon is passed as last child of a \'button\' `variant`', () => {
            const children: React.ReactNode = (
                <Fragment>
                    Label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot }: ISetup = setup({ children });
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-left-icon`)).toEqual(false);
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-right-icon`)).toEqual(true);
        });

        it('should have both "left-icon" and "right-icon" CSS classes when icons are passed as first and last children of a \'button\' `variant`', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    Label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot }: ISetup = setup({ children });
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-left-icon`)).toEqual(true);
            expect(buttonRoot.hasClass(`${CLASSNAME}--has-right-icon`)).toEqual(true);
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
