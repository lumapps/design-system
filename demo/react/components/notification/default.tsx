import React, { Fragment, useCallback } from 'react';

import { Button, NotificationTheme } from 'LumX';
import {
    NotificationAction,
    NotificationProvider,
    useNotification,
} from 'LumX/components/notification/react/NotificationProvider';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: NotificationTheme;
}

/////////////////////////////

/**
 * The demo for the default <Notification>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <NotificationProvider>
            <NotificationClient theme={theme} />
        </NotificationProvider>
    </Fragment>
);

const NotificationClient: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    const dispatch: React.Dispatch<NotificationAction> = useNotification();

    const info: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = useCallback(
        (evt: React.MouseEvent<HTMLButtonElement>): void =>
            dispatch({
                payload: {
                    content: evt.currentTarget.value,
                    handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                },
                type: 'info',
            }),
        [],
    );

    const success: (evt: React.MouseEvent<HTMLButtonElement>) => void = useCallback(
        (evt: React.MouseEvent<HTMLButtonElement>): void =>
            dispatch({
                payload: {
                    content: evt.currentTarget.value,
                    handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                },
                type: 'success',
            }),
        [],
    );

    const warning: (evt: React.MouseEvent<HTMLButtonElement>) => void = useCallback(
        (evt: React.MouseEvent<HTMLButtonElement>): void =>
            dispatch({
                payload: {
                    content: evt.currentTarget.value,
                    handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                },
                type: 'warning',
            }),
        [],
    );

    const error: (evt: React.MouseEvent<HTMLButtonElement>) => void = useCallback(
        (evt: React.MouseEvent<HTMLButtonElement>): void =>
            dispatch({
                payload: {
                    content: evt.currentTarget.value,
                    handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                },
                type: 'error',
            }),
        [],
    );

    const infoWithCallback: (evt: React.MouseEvent<HTMLButtonElement>) => void = useCallback(
        (evt: React.MouseEvent<HTMLButtonElement>): void =>
            dispatch({
                payload: {
                    actionCallback: (): void =>
                        dispatch({
                            payload: {
                                content: 'Callback',
                                handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                            },
                            type: 'success',
                        }),
                    actionLabel: 'Undo',
                    content: evt.currentTarget.value,
                    handleClick: (): void => dispatch({ payload: {}, type: 'close' }),
                },
                type: 'info',
            }),
        [],
    );

    return (
        <Fragment>
            <Button type="button" theme={theme} onClick={info} value="Info">
                Info
            </Button>{' '}
            <Button type="button" theme={theme} onClick={success} value="Success">
                Success
            </Button>{' '}
            <Button type="button" theme={theme} onClick={warning} value="Warning">
                Warning
            </Button>{' '}
            <Button type="button" theme={theme} onClick={error} value="Error">
                Error
            </Button>{' '}
            <Button type="button" theme={theme} onClick={infoWithCallback} value="Info with callback">
                Info with callback
            </Button>{' '}
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
