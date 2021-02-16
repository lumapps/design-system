import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import { ColorPalette } from '@lumx/react';
import { mdiAbTesting } from '@lumx/icons';
import { Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass, getRootClassName } from '@lumx/react/utils';
import { Flag, FlagProps } from './Flag';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<FlagProps> = {}, shallowRendering = true) => {
    const props = {
        label: 'default',
        ...propOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Flag {...props} />);

    return {
        props,
        iconEl: wrapper.find('Icon'),
        wrapper,
    };
};

describe('<Flag />', () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshot', () => {
        it('should render correctly Flag component', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should use the icon', () => {
            const { iconEl } = setup({ icon: mdiAbTesting });

            expect(iconEl).toBeDefined();
            expect(iconEl.prop('icon')).toEqual(mdiAbTesting);
        });

        it('should use the color', () => {
            const color = ColorPalette.green;
            const { wrapper, iconEl } = setup({ icon: mdiAbTesting, color });

            expect(iconEl.prop('color')).toEqual(color);
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: getRootClassName('Flag'),
                    type: 'color',
                    value: color,
                }),
            );
        });
    });

    // 5. Test state.
    // N/A.
});
