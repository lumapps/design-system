import React, { useRef, useState } from 'react';

import isFunction from 'lodash/isFunction';

import { Button, Notification, NotificationType } from '@lumx/react';

const App = ({ theme }) => {
    const [notificationProps, setNotificationProps] = useState(null);
    const notificationPropsRef = useRef(notificationProps);
    notificationPropsRef.current = notificationProps;

    const [timer, setTimer] = useState(null);
    const timerRef = useRef(timer);
    timerRef.current = timer;

    const properties = {
        ['info']: {
            isOpen: true,
            type: NotificationType.info,
            content: 'Info',
            handleClick: () => close(),
        },

        ['success']: {
            isOpen: true,
            type: NotificationType.success,
            content: 'Success',
            handleClick: () => close(),
        },

        ['warning']: {
            isOpen: true,
            type: NotificationType.warning,
            content: 'Warning',
            handleClick: () => close(),
        },
        ['error']: {
            isOpen: true,
            type: NotificationType.error,
            content: 'Error',
            handleClick: () => close(),
        },
        ['infoWithCallback']: {
            actionCallback: () => {
                close(() => {
                    setNotificationProps({
                        isOpen: true,
                        content: 'Callback',
                        handleClick: () => close(),
                        type: 'success',
                    });
                    setupTimer();
                });
            },
            actionLabel: 'Undo',
            isOpen: true,
            content: 'Info with callback',
            handleClick: () => close(),
            type: NotificationType.info,
        },
    };

    const open = (type) => {
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

    const close = (callback) => {
        setNotificationProps({ ...notificationPropsRef.current, isOpen: false });

        setTimeout(() => {
            setNotificationProps({ type: undefined });

            if (isFunction(callback)) {
                callback();
            }
        }, 200);
    };

    const setupTimer = () => {
        if (timerRef && timerRef.current > 0) {
            clearTimeout(timerRef.current);
        }

        const timerId = setTimeout(() => {
            close();
        }, 5000);

        setTimer(timerId);
    };

    return (
        <>
            <Button type="button" theme={theme} onClick={() => open('info')}>
                Info
            </Button>
            <Button type="button" theme={theme} onClick={() => open('success')}>
                Success
            </Button>
            <Button type="button" theme={theme} onClick={() => open('warning')}>
                Warning
            </Button>
            <Button type="button" theme={theme} onClick={() => open('error')}>
                Error
            </Button>
            <Button type="button" theme={theme} onClick={() => open('infoWithCallback')}>
                Info with callback
            </Button>

            {notificationProps !== null && <Notification {...notificationProps} />}
        </>
    );
};

export default App;
