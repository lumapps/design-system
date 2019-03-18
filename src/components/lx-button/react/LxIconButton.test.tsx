import { LxIconButtonProps } from './LxIconButton';

/////////////////////////////

import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { LxIcon, LxIconButton } from 'LumX';
import { ICommonSetup } from 'LumX/core/testing/utils.test';
import { mdiPlus } from 'LumX/icons';

/////////////////////////////

/**
 * Defines what is returned by the setup function.
 */
interface ISetup extends ICommonSetup {
    /**
     * The properties of the tested component.
     */
    props: LxIconButtonProps;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {LxIconButtonProps} props The props to use to override the default props of the component.
 * @return {ISetup}            An object with the props, the component wrapper and some shortcut to some element inside of
 *                             the component.
 */
const setup = ({ ...propsOverrides }: LxIconButtonProps): ISetup => {
    const props: LxIconButtonProps = {
        ...propsOverrides,
    };

    const wrapper: ShallowWrapper = shallow(<LxIconButton {...props} />);

    return {
        props,
        wrapper,
    };
};

describe(`<${LxIconButton.displayName}>`, () => {
    // 1. Test render via snapshot (default state of component).

    it('should render correctly', () => {
        const { wrapper } = setup({ children: <LxIcon icon={mdiPlus} /> });
        expect(wrapper).toMatchSnapshot();
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.

    /////////////////////////////

    // 3. Test events.

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).

    /////////////////////////////

    // 5. Test state.
});
