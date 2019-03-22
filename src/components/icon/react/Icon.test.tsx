import React from 'react';

import { mount, shallow } from 'enzyme';
import { build, fake, oneOf } from 'test-data-bot';

import { ICommonSetup, Wrapper } from 'LumX/core/testing/utils.test';
import { getBasicClass } from 'LumX/core/utils';
import { mdiCheck, mdiPlus } from 'LumX/icons';

import { CLASSNAME, Icon, IconProps, Sizes } from './Icon';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<IconProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <i> element that wraps the <svg> element.
     */
    i: Wrapper;

    /**
     * The <path> element that holds the icon path.
     */
    path: Wrapper;

    /**
     * The <svg> element that holds the SVG <path> of the icon.
     */
    svg: Wrapper;
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
    const props: IconProps = {
        icon: 'mdiPlus',
        ...propsOverrides,
    };

    const renderer: (el: JSX.Element) => Wrapper = shallowRendering ? shallow : mount;

    const wrapper: Wrapper = renderer(<Icon {...props} />);

    return {
        i: wrapper.find('i'),
        path: wrapper.find('path'),
        svg: wrapper.find('svg'),

        props,
        wrapper,
    };
};

describe(`<${Icon.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { i, path, svg, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(i).toExist();
            expect(i).toHaveClassName(CLASSNAME);

            expect(svg).toExist();
            expect(path).toExist();
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it("shouldn't use any default props", (): void => {
            const { i }: ISetup = setup();

            ['color', 'size'].forEach(
                (prop: string): void => {
                    expect(i).not.toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: prop, value: '' }));
                },
            );
        });

        it('should use the given props', (): void => {
            const modifiedPropsBuilder: () => ISetupProps = build('props').fields({
                // tslint:disable-next-line: no-any
                color: fake((fakeData: any) => fakeData.commerce.color()),
                icon: oneOf(mdiPlus, mdiCheck),
                size: oneOf(...Object.values(Sizes)),
            });

            const modifiedProps: ISetupProps = modifiedPropsBuilder();

            const { i, path }: ISetup = setup({ ...modifiedProps });

            Object.keys(modifiedProps).forEach(
                (prop: string): void => {
                    if (prop === 'icon') {
                        expect(path).toHaveProp('d', modifiedProps[prop]);
                    } else {
                        expect(i).toHaveClassName(
                            getBasicClass({ prefix: CLASSNAME, type: prop, value: modifiedProps[prop] }),
                        );
                    }
                },
            );
        });

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { i }: ISetup = setup(modifiedProps);

            expect(i).toHaveClassName(CLASSNAME);
            expect(i).toHaveClassName(modifiedProps.className);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { i }: ISetup = setup(modifiedProps);

            expect(i).toHaveProp(testedProp, modifiedProps[testedProp]);
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
        it('should fail when no `icon` is given', (): void => {
            expect(
                (): void => {
                    // We know that icon must be given to <Icon>, but for the test, ignore it.
                    // @ts-ignore
                    // tslint:disable-next-line: no-null-keyword
                    setup({ icon: null });
                },
            ).toThrowErrorMatchingSnapshot();
        });
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', (): void => {
        // Nothing to do here.
    });
});
