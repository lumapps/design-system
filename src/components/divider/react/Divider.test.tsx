import React from 'react';

import { mount, shallow } from 'enzyme';

import { ICommonSetup, Wrapper } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';

import { CLASSNAME, DEFAULT_PROPS, Divider, DividerProps, Themes } from './Divider';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<DividerProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <hr> element.
     */
    hr: Wrapper;
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
    const props: DividerProps = {
        children: 'Label',
        ...propsOverrides,
    };

    const renderer: (el: JSX.Element) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Divider {...props} />);

    return {
        hr: wrapper.find('hr'),

        props,
        wrapper,
    };
};

describe(`<${Divider.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { hr, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(hr).toExist();
            expect(hr).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { hr }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    expect(hr).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                    );
                },
            );
        });

        it('should use the given `theme`', (): void => {
            const testedProp: string = 'theme';
            const modifiedProps: ISetupProps = {
                [testedProp]: Themes.dark,
            };

            const { hr }: ISetup = setup(modifiedProps);

            expect(hr).toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: modifiedProps[testedProp] }),
            );
            expect(hr).not.toHaveClassName(
                getBasicClass({ prefix: CLASSNAME, type: testedProp, value: DEFAULT_PROPS[testedProp] }),
            );
        });

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { hr }: ISetup = setup(modifiedProps);

            expect(hr).toHaveClassName(CLASSNAME);
            expect(hr).toHaveClassName(modifiedProps.className);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { hr }: ISetup = setup(modifiedProps);

            expect(hr).toHaveProp(testedProp, modifiedProps[testedProp]);
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
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
