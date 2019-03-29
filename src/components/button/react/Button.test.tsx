import React from 'react';

import { mount, shallow } from 'enzyme';
import mockConsole from 'jest-mock-console';
import { build, fake, oneOf } from 'test-data-bot';

import get from 'lodash/get';
import without from 'lodash/without';

import { ICommonSetup, Wrapper, commonTestsSuite } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';
import { mdiCheck, mdiChevronDown, mdiPlus } from 'LumX/icons';

import { Button, ButtonProps, CLASSNAME, DEFAULT_PROPS, Emphasises, Sizes, Themes, Variants } from './Button';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<ButtonProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <ButtonRoot> element that is used as a wrapper for the label.
     */
    buttonRoot: Wrapper;

    /**
     * The <Icon> icon(s) (can have 0, 1 or 2).
     */
    icon: Wrapper;
}

/////////////////////////////
//                         //
//    Private attributes   //
//                         //
/////////////////////////////

/**
 * The default label to use for the tests.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const DEFAULT_LABEL: string = 'Label';

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Get the default value of the given prop of a <Button>, depending on the effective props of the component (some
 * default value depends on the value of another prop).
 *
 * @param {string}      prop  The name of the prop you want the default value of.
 * @param {ISetupProps} props The current props of the <Button>.
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
 * @param  {boolean}     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return {ISetup}      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup: (props?: ISetupProps, shallowRendering?: boolean) => ISetup = (
    { ...propsOverrides }: ISetupProps = {},
    shallowRendering: boolean = true,
): ISetup => {
    const props: ButtonProps = {
        children: DEFAULT_LABEL,
        ...propsOverrides,
    };

    const renderer: (el: React.ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Button {...props} />);

    return {
        buttonRoot: wrapper.find('ButtonRoot'),

        icon: wrapper.find('Icon'),

        props,
        wrapper,
    };
};

describe(`<${Button.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly a text label', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).not.toExist();

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly a <span> label', (): void => {
            const children: React.ReactNode = <span>{DEFAULT_LABEL}</span>;

            const { buttonRoot, icon, wrapper }: ISetup = setup({ children });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).not.toExist();

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly a left icon and a text label', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({ leftIcon: mdiPlus });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly a left icon and a <span> label', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({
                children: <span>{DEFAULT_LABEL}</span>,
                leftIcon: mdiPlus,
            });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly a text label and a right icon', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({ rightIcon: mdiChevronDown });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly a <span> label and a right icon', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({
                children: <span>{DEFAULT_LABEL}</span>,
                rightIcon: mdiChevronDown,
            });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly two icons and a text label', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({ leftIcon: mdiPlus, rightIcon: mdiChevronDown });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(2);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it('should render correctly two icons and a <span> label', (): void => {
            const { buttonRoot, icon, wrapper }: ISetup = setup({
                children: <span>{DEFAULT_LABEL}</span>,
                leftIcon: mdiPlus,
                rightIcon: mdiChevronDown,
            });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(2);

            expect(buttonRoot.contains(DEFAULT_LABEL)).toBeTrue();
        });

        it("should render correctly an icon button with the 'button' `variant`", (): void => {
            mockConsole('info');

            let { buttonRoot, icon, wrapper }: ISetup = setup({ children: null, leftIcon: mdiPlus });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            /////////////////////////////

            ({ buttonRoot, icon, wrapper } = setup({ children: null, rightIcon: mdiChevronDown }));
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
        });

        it("should render correctly an icon button with the 'icon' `variant`", (): void => {
            let { buttonRoot, icon, wrapper }: ISetup = setup({
                children: null,
                leftIcon: mdiPlus,
                variant: Variants.icon,
            });
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);

            /////////////////////////////

            ({ buttonRoot, icon, wrapper } = setup({
                children: null,
                rightIcon: mdiChevronDown,
                variant: Variants.icon,
            }));
            expect(wrapper).toMatchSnapshot();

            expect(buttonRoot).toExist();
            expect(buttonRoot).toHaveClassName(CLASSNAME);

            expect(icon).toExist();
            expect(icon.length).toEqual(1);
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
                // tslint:disable-next-line: no-any
                color: fake((fakeData: any): string => fakeData.commerce.color()),
                emphasis: oneOf(...without(Object.values(Emphasises), DEFAULT_PROPS.emphasis)),
                leftIcon: oneOf(mdiPlus, mdiCheck),
                size: oneOf(...without(Object.values(Sizes), DEFAULT_PROPS.size)),
                theme: oneOf(...without(Object.values(Themes), DEFAULT_PROPS.theme)),
                variant: Variants.icon,
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            let { buttonRoot }: ISetup = setup({ children: null, ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'leftIcon' || prop === 'rightIcon') {
                        return;
                    }

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

            delete modifiedProps.leftIcon;
            modifiedProps.rightIcon = mdiChevronDown;

            ({ buttonRoot } = setup({ children: null, ...modifiedProps }));

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'leftIcon' || prop === 'rightIcon') {
                        return;
                    }

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
                    if (prop === 'leftIcon' || prop === 'rightIcon') {
                        return;
                    }

                    expect(buttonRoot).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );

            /////////////////////////////

            delete modifiedProps.rightIcon;

            ({ buttonRoot } = setup({ ...modifiedProps }));

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'leftIcon' || prop === 'rightIcon') {
                        return;
                    }

                    expect(buttonRoot).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );

            /////////////////////////////

            delete modifiedProps.leftIcon;
            modifiedProps.rightIcon = mdiChevronDown;

            ({ buttonRoot } = setup({ ...modifiedProps }));

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'leftIcon' || prop === 'rightIcon') {
                        return;
                    }

                    expect(buttonRoot).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                    );
                },
            );
        });

        it("should not have any `theme` in 'low' or 'medium' `emphasis` but one in 'high'", (): void => {
            let { buttonRoot }: ISetup = setup({ emphasis: Emphasises.high });

            expect(buttonRoot.prop('className') as string).toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );

            /////////////////////////////

            ({ buttonRoot } = setup({ emphasis: Emphasises.medium }));

            expect(buttonRoot.prop('className') as string).not.toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );

            /////////////////////////////

            ({ buttonRoot } = setup({ emphasis: Emphasises.low }));

            expect(buttonRoot.prop('className') as string).not.toContain(
                getBasicClass({ prefix: CLASSNAME, type: 'theme', value: '' }),
            );
        });

        it('should forward any CSS class with icon(s)', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            let { buttonRoot }: ISetup = setup({ leftIcon: mdiPlus, ...modifiedProps });

            expect(buttonRoot).toHaveClassName(modifiedProps.className);

            /////////////////////////////

            ({ buttonRoot } = setup({ rightIcon: mdiChevronDown, ...modifiedProps }));

            expect(buttonRoot).toHaveClassName(modifiedProps.className);

            /////////////////////////////

            ({ buttonRoot } = setup({ leftIcon: mdiPlus, rightIcon: mdiChevronDown, ...modifiedProps }));

            expect(buttonRoot).toHaveClassName(modifiedProps.className);
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
                    /*
                     * If `console.warn` or `console.info` has been mocked at least one, this exists. So disable TS
                     * here.
                     */

                    // @ts-ignore
                    global.console.warn.mockRestore();
                    // @ts-ignore
                    global.console.info.mockRestore();
                } catch (exception) {
                    // Nothing to do here.
                }
            },
        );

        it("should fail when no child nor icons is given in the 'button' `variant`", (): void => {
            expect(
                (): void => {
                    setup({ children: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should fail when 2 icons are given without a label in the 'button' `variant`", (): void => {
            expect(
                (): void => {
                    setup({ children: null, leftIcon: mdiPlus, rightIcon: mdiChevronDown });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should fail when a label is given in the 'icon' `variant`", (): void => {
            expect(
                (): void => {
                    setup({ leftIcon: mdiPlus, variant: Variants.icon });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should fail when more than 1 icon is given in the 'icon' `variant`", (): void => {
            expect(
                (): void => {
                    setup({ children: null, leftIcon: mdiPlus, rightIcon: mdiChevronDown, variant: Variants.icon });
                },
            ).toThrowErrorMatchingSnapshot();
        });

        it("should inform the user when rendering an icon button with the 'button' `variant`", (): void => {
            global.console.info = jest.fn();

            setup({ children: null, leftIcon: mdiPlus });
            expect(global.console.info).toHaveBeenCalled();

            /////////////////////////////

            // @ts-ignore
            global.console.info.mockClear();

            setup({ children: null, rightIcon: mdiChevronDown });
            expect(global.console.info).toHaveBeenCalled();
        });

        it("should not inform the user when rendering an icon button with the 'icon' `variant`", (): void => {
            global.console.info = jest.fn();

            setup({ children: null, leftIcon: mdiPlus, variant: Variants.icon });
            expect(global.console.info).not.toHaveBeenCalled();

            /////////////////////////////

            // @ts-ignore
            global.console.info.mockClear();

            setup({ children: null, rightIcon: mdiChevronDown, variant: Variants.icon });
            expect(global.console.info).not.toHaveBeenCalled();
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

        it('should only have the "left-icon" CSS class when a left icon is passed in a \'button\' `variant`', (): void => {
            const { buttonRoot }: ISetup = setup({ leftIcon: mdiPlus });
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).not.toHaveClassName(`${CLASSNAME}--has-right-icon`);
        });

        it('should only have the "right-icon" CSS class when a right icon is passed in a \'button\' `variant`', (): void => {
            const { buttonRoot }: ISetup = setup({ rightIcon: mdiChevronDown });
            expect(buttonRoot).not.toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-right-icon`);
        });

        it('should have both "left-icon" and "right-icon" CSS classes when both left and right icons are passed in a \'button\' `variant`', (): void => {
            const { buttonRoot }: ISetup = setup({ leftIcon: mdiPlus, rightIcon: mdiChevronDown });
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-left-icon`);
            expect(buttonRoot).toHaveClassName(`${CLASSNAME}--has-right-icon`);
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'buttonRoot', prop: 'buttonRoot' }, { className: CLASSNAME });
});
