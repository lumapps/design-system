import { ESCAPE_KEY_CODE } from '@lumx/core/js/constants';
import { CLASSNAME, Dialog, DialogProps } from '@lumx/react/components/dialog/Dialog';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

import * as stories from './Dialog.stories';

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<DialogProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps the dialog and children elements.
     */
    wrapper: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...props }: ISetupProps = {}, shallowRendering = true): ISetup => {
    const renderer = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper = renderer(<Dialog isOpen {...props} />);

    return {
        props,
        wrapper,
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
                // @ts-ignore
                const wrapper = shallow(<Story />);
                expect(wrapper).toMatchSnapshot();
            });
        }
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        const onClose: jest.Mock = jest.fn();
        let eventListeners: {
            keydown?(evt);
        };

        beforeEach(() => {
            document.body.addEventListener = jest.fn((type, cb) => {
                eventListeners[type] = cb;
            });
            eventListeners = {};
            onClose.mockClear();
        });

        it('should trigger `onClose` when pressing `escape` key', () => {
            setup(
                {
                    isOpen: true,
                    onClose,
                },
                false,
            );

            eventListeners.keydown!({ keyCode: ESCAPE_KEY_CODE });
            expect(onClose).toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing any other key', () => {
            setup({ isOpen: true, onClose, closeOnEscape: true }, false);

            eventListeners.keydown!({ keyCode: 26 });
            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not trigger `onClose` when pressing `escape` key with `closeOnEscape` set to `false`', () => {
            setup({ isOpen: true, onClose, preventAutoClose: true }, false);

            eventListeners.keydown?.({ keyCode: ESCAPE_KEY_CODE });
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
