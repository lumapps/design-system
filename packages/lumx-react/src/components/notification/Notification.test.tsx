import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import noop from 'lodash/noop';

import { CommonSetup, Wrapper } from '@lumx/react/testing/utils';

import { CLASSNAME, Notification, NotificationProps, NotificationType } from './Notification';

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<NotificationProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <Portal> element that wraps notification elements.
     */
    wrapper: Wrapper;

    /**
     * The <div> element that wraps notification elements.
     */
    notification: Wrapper;

    /**
     * The <div> element that wraps the <icon> element.
     */
    icon: Wrapper;

    /**
     * The <div> element that wraps the content.
     */
    content: Wrapper;

    /**
     * The <div> element that wraps the action elements.
     */
    action: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  propsOverrides          The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (propsOverrides: SetupProps = {}, shallowRendering = true): Setup => {
    const props: NotificationProps = {
        ...propsOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Notification {...props} />);

    const notification: Wrapper = wrapper.find('.lumx-notification');
    const icon: Wrapper = wrapper.find('.lumx-notification__icon');
    const content: Wrapper = wrapper.find('.lumx-notification__content');
    const action: Wrapper = wrapper.find('.lumx-notification__action');

    return {
        action,
        content,
        icon,
        notification,
        props,
        wrapper,
    };
};

const properties = {
    error: {
        content: 'Error',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.error,
    },
    info: {
        content: 'Info',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    infoWithCallback: {
        actionCallback: noop,
        actionLabel: 'Undo',
        content: 'Info with callback',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.info,
    },
    success: {
        content: 'Success',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.success,
    },

    warning: {
        content: 'Warning',
        handleClick: noop,
        isOpen: true,
        type: NotificationType.warning,
    },
};

describe(`<${Notification.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render defaults', () => {
            const { wrapper, notification } = setup(properties.info);
            expect(wrapper).toMatchSnapshot();

            expect(notification).toExist();

            expect(notification).toHaveClassName(CLASSNAME);
            expect(notification).toHaveClassName(`${CLASSNAME}--color-dark`);
        });

        it('should render nothing since the notification is closed', () => {
            const { wrapper, notification } = setup({ ...properties.info, isOpen: false });
            expect(wrapper).toMatchSnapshot();

            expect(notification).not.toExist();
        });
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });
});
