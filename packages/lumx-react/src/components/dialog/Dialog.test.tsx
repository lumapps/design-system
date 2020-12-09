import { ESCAPE_KEY_CODE } from '@lumx/core/js/constants';
import { Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';
import { CommonSetup, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import * as stories from './Dialog.stories';

const CLASSNAME = Dialog.className as string;

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<DialogProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /** The portal that wraps the dialog and children elements. */
    wrapper: Wrapper;

    /** The dialog div */
    dialog: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true): Setup => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Dialog isOpen {...props} />);
    const dialog = wrapper.find(`.${CLASSNAME}`);

    return {
        props,
        wrapper,
        dialog,
    };
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
        const keyDown = (keyCode: any) => new KeyboardEvent('keydown', { keyCode });

        it('should trigger `onClose` when pressing `escape` key', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose }, false);

            document.body.dispatchEvent(keyDown(ESCAPE_KEY_CODE));
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose }, false);

            document.body.dispatchEvent(keyDown(26));
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `preventAutoClose` set to `true`', () => {
            const onClose = jest.fn();
            setup({ isOpen: true, onClose, preventAutoClose: true }, false);

            document.body.dispatchEvent(keyDown(ESCAPE_KEY_CODE));
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
