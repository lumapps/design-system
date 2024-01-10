import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Comp, GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import {
    NotificationStackContext,
    NotificationStackContextValue,
} from '@lumx/react/components/notification/NotificationStackContext';
import findLastIndex from 'lodash/findLastIndex';

/**
 * Defines the props of the component.
 */
export type NotificationStackProps = GenericProps;

/**
 * Component display name.
 */
const COMPONENT_NAME = 'NotificationStack';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<NotificationStackProps> = {
    zIndex: 9999,
};

/**
 * NotificationStack component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const NotificationStack: Comp<NotificationStackProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, children } = props;
    const callbacks = React.useMemo((): NotificationStackContextValue => {
        const notifications: HTMLElement[] = [];

        return {
            register(newNotification) {
                const index = findLastIndex(
                    notifications,
                    (notification) =>
                        notification.compareDocumentPosition(newNotification) === Node.DOCUMENT_POSITION_FOLLOWING,
                );
                notifications.splice(index > -1 ? index + 1 : notifications.length, 0, newNotification);

                console.log(
                    index,
                    notifications.map((n) => n.innerText),
                );
            },
            unregister(newNotification: HTMLElement) {
                const index = notifications.findIndex((n) => n === newNotification);
                if (index > -1) notifications.splice(index, 1);
                console.log(notifications.map((n) => n.innerText));
            },
        };
    }, []);

    return createPortal(
        <div ref={ref} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME }))}>
            <NotificationStackContext.Provider value={callbacks}>{children}</NotificationStackContext.Provider>
        </div>,
        document.body,
    );
});
NotificationStack.displayName = COMPONENT_NAME;
NotificationStack.className = CLASSNAME;
NotificationStack.defaultProps = DEFAULT_PROPS;
