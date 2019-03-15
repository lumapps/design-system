import React from 'react';
import { shallow } from 'enzyme';

import { mdiPlus } from 'LumX/icons';

import { LxIconButton } from './LxIconButton';
import { LxButton } from './LxButton';
import { LxIcon } from '../../lx-icon/react/LxIcon';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {Object} propOverrides An object that will extend the default properties.
 * @return {Object} An object with some shortcuts to elements or data required in tests.
 */
const setup = (propOverrides) => {
    const props = {
        ...propOverrides,
    };

    LxButton.displayName = 'LxButton';
    LxIcon.displayName = 'LxIcon';
    LxIconButton.displayName = 'LxIconButton';

    const wrapper = shallow(
        <LxIconButton {...props}>
            <LxIcon icon={mdiPlus} />
        </LxIconButton>,
    );

    return {
        props,
        wrapper,
    };
};

describe('<LxIconButton />', () => {
    // 1. Test render via snapshot (default state of component).
    it('should render correctly <LxIconButton> component', () => {
        const { wrapper } = setup();
        expect(wrapper).toMatchSnapshot();
    });

    // 2. Test defaultProps value and important props custom values.
    // N/A.

    // 3. Test events.
    // N/A.

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    // N/A.

    // 5. Test state.
    // N/A.
});
