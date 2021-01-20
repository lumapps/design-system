import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { Dropdown, DropdownProps } from './Dropdown';

const CLASSNAME = Dropdown.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: Partial<DropdownProps> = {}, shallowRendering = true) => {
    const anchorRef = React.createRef<HTMLButtonElement>();
    const props: DropdownProps = {
        anchorRef,
        children: <div>This is the content of the dropdown</div>,
        isOpen: true,
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Dropdown {...props} />);
    return {
        props,
        wrapper,
    };
};

describe(`<${Dropdown.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const onClose: jest.Mock = jest.fn();
        let eventListeners: {
            keydown?(evt: any): void;
        };

        beforeEach(() => {
            document.body.addEventListener = jest.fn((type, cb) => {
                (eventListeners as any)[type] = cb;
            });
            eventListeners = {};
            onClose.mockClear();
        });

        it('should trigger `onClose` when pressing `escape` key', () => {
            setup(
                {
                    closeOnEscape: true,
                    onClose,
                    isOpen: true,
                },
                false,
            );

            eventListeners.keydown?.({ key: 'Escape' });
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', () => {
            setup({ isOpen: true, onClose, closeOnEscape: true }, false);

            eventListeners.keydown?.({ key: 'a' });
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `closeOnEscape` set to `false`', () => {
            setup({ isOpen: true, onClose, closeOnEscape: false }, false);

            eventListeners.keydown?.({ key: 'Escape' });
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
