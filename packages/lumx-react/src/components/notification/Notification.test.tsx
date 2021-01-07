import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import noop from 'lodash/noop';
import { Kind } from '@lumx/react';
import { Wrapper } from '@lumx/react/testing/utils';

import { Notification, NotificationProps } from './Notification';

const CLASSNAME = Notification.className as string;

type SetupProps = Partial<NotificationProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Notification {...props} />);

    const notification: Wrapper = wrapper.find('.lumx-notification');
    const icon: Wrapper = wrapper.find('.lumx-notification__icon');
    const content: Wrapper = wrapper.find('.lumx-notification__content');
    const action: Wrapper = wrapper.find('.lumx-notification__action');

    return { action, content, icon, notification, props, wrapper };
};

const properties = {
    error: {
        content: 'Error',
        onClick: noop,
        isOpen: true,
        type: Kind.error,
    },
    info: {
        content: 'Info',
        onClick: noop,
        isOpen: true,
        type: Kind.info,
    },
    infoWithCallback: {
        onActionClick: noop,
        actionLabel: 'Undo',
        content: 'Info with callback',
        onClick: noop,
        isOpen: true,
        type: Kind.info,
    },
    success: {
        content: 'Success',
        onClick: noop,
        isOpen: true,
        type: Kind.success,
    },

    warning: {
        content: 'Warning',
        onClick: noop,
        isOpen: true,
        type: Kind.warning,
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
