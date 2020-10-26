import { mdiPlay } from '@lumx/icons';
import { Button, Notification, NotificationType } from '@lumx/react';

import React, { useState } from 'react';

export const App = () => {
    const properties = {
        error: {
            content: 'Error',
            type: NotificationType.error,
        },
        info: {
            content: 'Info',
            type: NotificationType.info,
        },
        infoWithCallback: {
            actionLabel: 'Undo',
            content: 'Info with callback',
            type: NotificationType.info,
        },
        success: {
            content: 'Success',
            type: NotificationType.success,
        },
        warning: {
            content: 'Warning',
            type: NotificationType.warning,
        },
    };

    const [type, setType] = useState<keyof typeof properties | null>(null);
    const [timer, setTimer] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const close = () => {
        setIsOpen(false);
    };

    const open = (typeToDisplay: keyof typeof properties) => {
        setType(typeToDisplay);
        setIsOpen(true);
        setTimer(window.setTimeout(close, 3000));
    };

    const onClick = (typeToDisplay: keyof typeof properties) => () => {
        if (timer) {
            clearTimeout(timer);
        }

        /** If the notification is displayed, we need to close it, let the state be reflected and then open the notification once more */
        if (isOpen) {
            close();
            setTimeout(() => {
                open(typeToDisplay);
            }, 300);
        } else {
            open(typeToDisplay);
        }
    };

    return (
        <>
            <Button leftIcon={mdiPlay} onClick={onClick('info')}>
                Info
            </Button>

            <Button leftIcon={mdiPlay} onClick={onClick('success')}>
                Success
            </Button>

            <Button leftIcon={mdiPlay} onClick={onClick('warning')}>
                Warning
            </Button>

            <Button leftIcon={mdiPlay} onClick={onClick('error')}>
                Error
            </Button>

            <Button leftIcon={mdiPlay} onClick={onClick('infoWithCallback')}>
                Info with callback
            </Button>

            {type && (
                <Notification
                    isOpen={isOpen}
                    handleClick={close}
                    actionCallback={onClick('success')}
                    {...properties[type]}
                />
            )}
        </>
    );
};
