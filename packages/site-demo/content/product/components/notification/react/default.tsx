import { Button, Notification, NotificationProps, NotificationType } from '@lumx/react';

import isFunction from 'lodash/isFunction';
import React, { useRef, useState } from 'react';

const App = ({ theme }: any) => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const [notificationProps, setNotificationProps] = useState({} as NotificationProps);
    const notificationPropsRef = useRef(notificationProps);
    notificationPropsRef.current = notificationProps;

    const [timer, setTimer] = useState<number | null>(null);

    const open = (type: keyof typeof properties) => () => {
        if (notificationProps && notificationProps.isOpen) {
            close(() => {
                setNotificationProps({ ...properties[type] });
                setupTimer();
            });
        } else {
            setNotificationProps({ ...properties[type] });
            setupTimer();
        }
    };

    const close = (callback?: any) => {
        setNotificationProps({ ...notificationPropsRef.current, isOpen: false });

        setTimeout(() => {
            setNotificationProps({ type: undefined });

            if (isFunction(callback)) {
                callback();
            }
        }, 200);
    };

    const properties = {
        ['info']: {
            content: 'Info',
            handleClick: close,
            isOpen: true,
            type: NotificationType.info,
        },
        ['success']: {
            content: 'Success',
            handleClick: close,
            isOpen: true,
            type: NotificationType.success,
        },
        ['warning']: {
            content: 'Warning',
            handleClick: close,
            isOpen: true,
            type: NotificationType.warning,
        },
        ['error']: {
            content: 'Error',
            handleClick: close,
            isOpen: true,
            type: NotificationType.error,
        },
        ['infoWithCallback']: {
            actionCallback() {
                close(() => {
                    setNotificationProps({
                        content: 'Callback',
                        handleClick: close,
                        isOpen: true,
                        type: NotificationType.success,
                    });
                    setupTimer();
                });
            },
            actionLabel: 'Undo',
            content: 'Info with callback',
            handleClick: close,
            isOpen: true,
            type: NotificationType.info,
        },
    };

    const setupTimer = () => {
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(window.setTimeout(close, 5000));
    };

    return (
        <div className="demo-grid">
            <Button type="button" theme={theme} onClick={open('info')}>
                Info
            </Button>

            <Button type="button" theme={theme} onClick={open('success')}>
                Success
            </Button>

            <Button type="button" theme={theme} onClick={open('warning')}>
                Warning
            </Button>

            <Button type="button" theme={theme} onClick={open('error')}>
                Error
            </Button>

            <Button type="button" theme={theme} onClick={open('infoWithCallback')}>
                Info with callback
            </Button>

            {notificationProps !== null && <Notification {...notificationProps} />}
        </div>
    );
};

export default App;
