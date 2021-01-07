import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import { ColorPalette, Theme } from '@lumx/react';
import { Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';
import { Chip, ChipProps } from './Chip';

const CLASSNAME = Chip.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<ChipProps> = {}, shallowRendering = true) => {
    const props = {
        ...propOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Chip {...props} />);

    return {
        after: wrapper.find('.lumx-chip__after') as any,
        before: wrapper.find('.lumx-chip__before') as any,
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
            stopPropagation: (): boolean => true,
        };
        const clearClickMocks = () => {
            [mockOnClick, mockOnAfterClick, mockOnBeforeClick].forEach((func) => func.mockClear());
        };

        beforeEach(() => clearClickMocks);

        it('should trigger onBeforeClick only when clicking on the "before" element', () => {
            const { after, before, wrapper } = setup({
                after: 'after',
                before: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).not.toHaveBeenCalled();

            clearClickMocks();

            after.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).not.toHaveBeenCalled();

            clearClickMocks();

            before.simulate('click', mockClickEvent);
            expect(mockOnBeforeClick).toHaveBeenCalled();
        });

        it('should trigger onClick when clicking on the label area', () => {
            const { after, before, wrapper } = setup({
                after: 'after',
                before: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click');
            expect(mockOnClick).toHaveBeenCalled();

            clearClickMocks();

            after.simulate('click');
            expect(mockOnClick).not.toHaveBeenCalled();

            clearClickMocks();

            before.simulate('click');
            expect(mockOnClick).not.toHaveBeenCalled();
        });

        it('should trigger onAfterClick only when clicking on the "after" element', () => {
            const { after, before, wrapper } = setup({
                after: 'after',
                before: 'before',
                onAfterClick: mockOnAfterClick,
                onBeforeClick: mockOnBeforeClick,
                onClick: mockOnClick,
            });

            wrapper.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).not.toHaveBeenCalled();

            clearClickMocks();

            after.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).toHaveBeenCalled();

            clearClickMocks();

            before.simulate('click', mockClickEvent);
            expect(mockOnAfterClick).not.toHaveBeenCalled();
        });

        it('should not stop propagation when clicking on a "before"or "after" element without an event handler', () => {
            const onClick = jest.fn();
            const { after, before } = setup(
                {
                    after: 'after',
                    before: 'before',
                    onClick,
                },
                false,
            );

            before.simulate('click', mockClickEvent);
            expect(onClick).toHaveBeenCalled();

            onClick.mockClear();

            after.simulate('click', mockClickEvent);
            expect(onClick).toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should have an extra class on the "before" element if it is clickable', () => {
            let { before } = setup({ before: 'before 1' });
            expect(before).toHaveLength(1);
            expect(before.hasClass('lumx-chip__before--is-clickable')).toEqual(false);

            ({ before } = setup({ before: 'before 2', onBeforeClick: (): boolean => true }));
            expect(before).toHaveLength(1);
            expect(before.hasClass('lumx-chip__before--is-clickable')).toEqual(true);
        });

        it('should have an extra class on the "after" element if it is clickable', () => {
            let { after } = setup({ after: 'after 1' });
            expect(after).toHaveLength(1);
            expect(after.hasClass('lumx-chip__after--is-clickable')).toEqual(false);

            ({ after } = setup({ after: 'after 2', onAfterClick: (): boolean => true }));
            expect(after).toHaveLength(1);
            expect(after.hasClass('lumx-chip__after--is-clickable')).toEqual(true);
        });

        it('should have correct default color', () => {
            const { wrapper } = setup({});
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: CLASSNAME,
                    type: 'color',
                    value: ColorPalette.dark,
                }),
            );
        });

        it('should switch color with theme', () => {
            const { wrapper } = setup({ theme: Theme.dark });
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: CLASSNAME,
                    type: 'color',
                    value: ColorPalette.light,
                }),
            );
        });

        it('should use color over the theme', () => {
            const color = ColorPalette.red;
            const { wrapper } = setup({ theme: Theme.dark, color });
            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'color', value: color }));
        });
    });

    // 5. Test state.
    // N/A.
});
