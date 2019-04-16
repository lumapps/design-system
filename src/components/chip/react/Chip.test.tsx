import { shallow } from 'enzyme';
import React from 'react';

import { Chip } from './Chip';

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  {Object} propOverrides An object that will extend the default properties.
 * @return {Object} An object with some shortcuts to elements or data required in tests.
 */
const setup = (propOverrides = {}) => {
    const props = {
        LabelComponent: 'Hello World!',
        ...propOverrides,
    };
    const wrapper = shallow(<Chip {...props} />);

    return {
        afterElement: wrapper.find('.lumx-chip__after'),
        beforeElement: wrapper.find('.lumx-chip__before'),
        labelElement: wrapper.find('.lumx-chip__label'),
        props,
        wrapper,
    };
};

describe('<Chip />', () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshot', () => {
        it('should render correctly Chip component', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    // N/A.

    // 3. Test events.
    describe('Events', () => {
        const mockOnClick = jest.fn();
        const mockOnAfterClick = jest.fn();
        const mockOnBeforeClick = jest.fn();
        const mockClickEvent = {
            stopPropagation: () => true,
        };
        const clearClickMocks = () => {
            [mockOnClick, mockOnAfterClick, mockOnBeforeClick].forEach((func) => func.mockClear());
        };

        beforeEach(() => clearClickMocks);

        it('should trigger onBeforeClick only when clicking on the "before" element', () => {
            const { afterElement, beforeElement, wrapper } = setup({
                AfterComponent: 'after',
                BeforeComponent: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).not.toHaveBeenCalled();

            clearClickMocks();

            afterElement.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).not.toHaveBeenCalled();

            clearClickMocks();

            beforeElement.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).toHaveBeenCalled();
        });

        it('should trigger onClick when clicking on the label area', () => {
            const { afterElement, beforeElement, wrapper } = setup({
                AfterComponent: 'after',
                BeforeComponent: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click');
            expect(mockOnClick).toHaveBeenCalled();

            clearClickMocks();

            afterElement.simulate('click');
            expect(mockOnClick).not.toHaveBeenCalled();

            clearClickMocks();

            beforeElement.simulate('click');
            expect(mockOnClick).not.toHaveBeenCalled();
        });

        it('should trigger onAfterClick only when clicking on the "after" element', () => {
            const { afterElement, beforeElement, wrapper } = setup({
                AfterComponent: 'after',
                BeforeComponent: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).not.toHaveBeenCalled();

            clearClickMocks();

            afterElement.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).toHaveBeenCalled();

            clearClickMocks();

            beforeElement.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).not.toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should have an extra class on the "before" element if it is clickable', () => {
            let { beforeElement } = setup({ BeforeComponent: 'before 1' });
            expect(beforeElement).toHaveLength(1);
            expect(beforeElement.hasClass('lumx-chip__before--is-clickable')).toEqual(false);

            ({ beforeElement } = setup({ BeforeComponent: 'before 2', onBeforeClick: () => true }));
            expect(beforeElement).toHaveLength(1);
            expect(beforeElement.hasClass('lumx-chip__before--is-clickable')).toEqual(true);
        });

        it('should have an extra class on the "after" element if it is clickable', () => {
            let { afterElement } = setup({ AfterComponent: 'after 1' });
            expect(afterElement).toHaveLength(1);
            expect(afterElement.hasClass('lumx-chip__after--is-clickable')).toEqual(false);

            ({ afterElement } = setup({ AfterComponent: 'after 2', onAfterClick: () => true }));
            expect(afterElement).toHaveLength(1);
            expect(afterElement.hasClass('lumx-chip__after--is-clickable')).toEqual(true);
        });
    });

    // 5. Test state.
    // N/A.
});
