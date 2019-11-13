import { shallow } from 'enzyme';
import React from 'react';

import { ICommonSetup } from 'LumX/core/testing/utils.test';
import { Chip } from './Chip';
import { ChipGroup, ChipGroupProps } from './ChipGroup';

interface ISetup extends ICommonSetup {}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param propOverrides An object that will extend the default properties.
 * @return An object with some shortcuts to elements or data required in tests.
 */
const setup = (propOverrides: Partial<ChipGroupProps> = {}): ISetup => {
    const props = {
        children: [<Chip key="1">Chip 1</Chip>, <Chip key="2">Chip 2</Chip>, <Chip key="3">Chip 3</Chip>],
        ...propOverrides,
    };

    const wrapper = shallow(<ChipGroup {...props} />);

    return {
        props,
        wrapper,
    };
};

describe('<ChipGroup />', () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshot', () => {
        it('should render correctly Chip Group component', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });
});
