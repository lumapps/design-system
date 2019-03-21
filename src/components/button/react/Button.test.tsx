import { ICommonSetup } from 'LumX/core/testing/utils.test';

/////////////////////////////

import React, { Fragment } from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import get from 'lodash/get';
import without from 'lodash/without';

import { LxIcon } from 'LumX';
import { getBasicClass } from 'LumX/core/utils';
import { mdiPlus } from 'LumX/icons';

import { CLASSNAME, DEFAULT_PROPS, Emphasises, LxButton, LxButtonProps, Sizes, Themes, Variants } from './Button';

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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).not.toExist();
            expect(label).toExist();
        });

        it('should render correctly a <span> label', (): void => {
            const children: React.ReactNode = <span>Label</span>;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).not.toExist();
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(2);
            expect(label).toExist();
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

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(2);
            expect(label).toExist();
        });

        it("should render correctly an icon button with the 'button' `variant`", (): void => {
            mockConsole();

            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).not.toExist();
        });

        it("should render correctly an icon button with the 'icon' `variant`", (): void => {
            const children: React.ReactNode = <LxIcon icon={mdiPlus} />;

            const { buttonRoot, icon, label, wrapper }: ISetup = setup({ children, variant: Variants.icon });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
            expect(label).not.toExist();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { buttonRoot }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    expect(buttonRoot).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: _getDefaultPropValue({ prop }) }),
                    );
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                color: fake((fakeData) => fakeData.commerce.color()),
                emphasis: oneOf(...without(Object.values(Emphasises), Emphasises.high)),
                size: oneOf(...Object.values(Sizes)),
                theme: oneOf(...Object.values(Themes)),
                variant: Variants.icon,
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            let { buttonRoot }: ISetup = setup({ children: <LxIcon icon="mdiPlus" />, ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'theme') {
                        expect(buttonRoot).not.toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] as string }),
                        );
                    } else {
                        expect(buttonRoot).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                        );
                    }
                },
            );

            /////////////////////////////

            modifiedProps.emphasis = Emphasises.high;
            modifiedProps.variant = Variants.button;

            ({ buttonRoot } = setup({ ...modifiedProps }));

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    expect(buttonRoot).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );
        });

        it("should not have any `theme` in 'low' or 'medium' `emphasis` but one in 'high'", (): void => {
            let { buttonRoot }: ISetup = setup({ emphasis: Emphasises.high });

            expect(buttonRoot.prop('className')).toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );

            /////////////////////////////

            ({ buttonRoot } = setup({ emphasis: Emphasises.medium }));

            expect(buttonRoot.prop('className')).not.toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );

            /////////////////////////////

            ({ buttonRoot } = setup({ emphasis: Emphasises.low }));

            expect(buttonRoot.prop('className')).not.toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );
        });

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { buttonRoot }: ISetup = setup(modifiedProps);

            expect(buttonRoot).toHaveClassName(CLASSNAME);
            expect(buttonRoot).toHaveClassName(modifiedProps.className);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { buttonRoot }: ISetup = setup(modifiedProps);

            expect(buttonRoot).toHaveProp(testedProp, modifiedProps[testedProp]);
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
                    <span>Label</span>
                    <span>Label 2</span>
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            expect(
                (): void => {
                    setup({ children });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a text, <span> or <${
            LxIcon.displayName
        }> is given as child in the 'button' \`variant\``, (): void => {
            mockConsole('debug');

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
                    <span>Label</span>
                    Label 2
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
                    Label
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
                    <span>Label</span>
                    <span>Label 2</span>
                </Fragment>
            );

            expect(
                (): void => {
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
                    setup({ children, variant: Variants.icon });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it(`should fail when anything else than a <${
            LxIcon.displayName
        }> is given as child in the 'icon' \`variant\``, (): void => {
            mockConsole('debug');

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
            expect(buttonRoot).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme }),
            );

            /////////////////////////////

            modifiedProps = {
                emphasis: Emphasises.medium,
            };

            ({ buttonRoot } = setup(modifiedProps));
            expect(buttonRoot).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme }),
            );

            /////////////////////////////

            modifiedProps = {
                emphasis: Emphasises.low,
            };

            ({ buttonRoot } = setup(modifiedProps));
            expect(buttonRoot).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: DEFAULT_PROPS.theme }),
            );
        });

        it('should only have the "left-icon" CSS class when an icon is passed as first child of a \'button\' `variant`', () => {
            const children: React.ReactNode = (
                <Fragment>
                    <LxIcon icon={mdiPlus} />
                    Label
                </Fragment>
            );

            const { buttonRoot }: ISetup = setup({ children });
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).not.toHaveClassName(`${CLASSNAME}--has-right-icon`);
        });

        it('should only have the "right-icon" CSS class when an icon is passed as last child of a \'button\' `variant`', () => {
            const children: React.ReactNode = (
                <Fragment>
                    Label
                    <LxIcon icon={mdiPlus} />
                </Fragment>
            );

            const { buttonRoot }: ISetup = setup({ children });
            expect(buttonRoot).not.toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-right-icon`);
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
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-right-icon`);
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
