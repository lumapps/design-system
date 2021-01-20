import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import * as stories from './Dialog.stories';

const CLASSNAME = Dialog.className as string;

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

type SetupProps = Partial<DialogProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Dialog isOpen {...props} />);
    const dialog = wrapper.find(`.${CLASSNAME}`);

    return { props, wrapper, dialog };
};

describe(`<${Dialog.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        // Do snapshot render test on every stories.
        for (const [storyName, Story] of Object.entries(stories)) {
            if (typeof Story !== 'function') {
                continue;
            }

            it(`should render story ${storyName}`, () => {
                const wrapper = shallow(<Story />);
                expect(wrapper).toMatchSnapshot();
            });
        }
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    // 3. Test events.
    describe('Events', () => {
        const keyDown = (key: string) => new KeyboardEvent('keydown', { key } as any);

        it('should trigger `onClose` when pressing `escape` key', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose }, false);

            document.body.dispatchEvent(keyDown('Escape'));
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose }, false);

            document.body.dispatchEvent(keyDown('a'));
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventAutoClose` set to `true`', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose, preventAutoClose: true }, false);

            document.body.dispatchEvent(keyDown('Escape'));
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
    commonTestsSuite(setup, { className: 'dialog', prop: 'dialog' }, { className: CLASSNAME });
});
