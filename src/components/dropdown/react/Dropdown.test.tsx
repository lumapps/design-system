import { ICommonSetup } from 'LumX/core/testing/utils.test';

/////////////////////////////

import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { getBasicClass } from 'LumX/core/utils';

import { CLASSNAME, DEFAULT_PROPS, LxDropdown, LxDropdownProps } from './Dropdown';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<LxDropdownProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that holds the dropdown content.
     */
    dropdown: ShallowWrapper;
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
    const props: LxDropdownProps = {
        children: 'This is the content of the dropdown',
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxDropdown {...props} />);

    return {
        dropdown: wrapper.find('div').first(),

        props,
        wrapper,
    };
};

describe(`<${LxDropdown.displayName}>`, (): void => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', (): void => {
        it('should render correctly', (): void => {
            const { dropdown, wrapper }: ISetup = setup();
            expect(wrapper).toMatchSnapshot();

            expect(dropdown).toExist();
            expect(dropdown).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', (): void => {
        it('should use default props', (): void => {
            const { dropdown }: ISetup = setup();

            Object.keys(DEFAULT_PROPS).forEach(
                (prop: string): void => {
                    expect(dropdown).toHaveClassName(
                        getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                    );
                },
            );
        });

        it('should forward any CSS class', (): void => {
            const modifiedProps: ISetupProps = {
                className: 'component component--is-tested',
            };

            const { dropdown }: ISetup = setup(modifiedProps);

            expect(dropdown).toHaveClassName(CLASSNAME);
            expect(dropdown).toHaveClassName(modifiedProps.className);
        });

        it('should forward any other prop', (): void => {
            const testedProp: string = 'winter';
            const modifiedProps: ISetupProps = {
                [testedProp]: 'is coming',
            };

            const { dropdown }: ISetup = setup(modifiedProps);

            expect(dropdown).toHaveProp(testedProp, modifiedProps[testedProp]);
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
