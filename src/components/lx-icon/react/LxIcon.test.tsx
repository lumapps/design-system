import { ICommonSetup } from 'LumX/core/testing/utils.test';

/////////////////////////////

import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';
import { build, fake, oneOf } from 'test-data-bot';

import { getBasicClass } from 'LumX/core/utils';
import { mdiCheck, mdiPlus } from 'LumX/icons';

import { CLASSNAME, DEFAULT_PROPS, LxIcon, LxIconProps, Sizes } from './LxIcon';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxIconProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <i> element that wraps the <svg> element.
     */
    i: ShallowWrapper;

    /**
     * The <path> element that holds the icon path.
     */
    path: ShallowWrapper;

    /**
     * The <svg> element that holds the SVG <path> of the icon.
     */
    svg: ShallowWrapper;
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
    const props: LxIconProps = {
        icon: 'mdiPlus',
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxIcon {...props} />);

    return {
        i: wrapper.find('i'),
        path: wrapper.find('path'),
        svg: wrapper.find('svg'),

        props,
        wrapper,
    };
};

describe(`<${LxIcon.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { i, path, svg, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(i.exists()).toEqual(true);
            expect(i.prop('className')).toContain(CLASSNAME);

            expect(svg.exists()).toEqual(true);
            expect(path.exists()).toEqual(true);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { i }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    expect(
                        i.hasClass(getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] })),
                    ).toEqual(true);
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                color: fake((fakeData) => fakeData.commerce.color()),
                icon: oneOf(mdiPlus, mdiCheck),
                size: oneOf(...Object.values(Sizes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { i, path }: ISetup = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'icon') {
                        expect(path.prop('d')).toEqual(modifiedProps[prop]);
                    } else {
                        expect(
                            i.hasClass(getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] })),
                        ).toEqual(true);
                    }
                },
            );
        });

        it('should forward any CSS class', (): void => {
            const testedProp: string = 'className';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'component component--is-tested',
            };

            const { i }: ISetup = setup(modifiedProps);

            expect(i.prop(testedProp)).toContain(CLASSNAME);
            expect(i.prop(testedProp)).toContain(modifiedProps[testedProp]);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { i }: ISetup = setup(modifiedProps);

            expect(i.prop(testedProp)).toEqual(modifiedProps[testedProp]);
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
