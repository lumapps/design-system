import React, { Fragment, useContext } from 'react';

import { Button, NotificationTheme } from 'LumX';
import {
    NotificationProvider,
    NotificationState,
    notificationContext,
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
    const { close, error, info, success, warning }: NotificationState = useContext(notificationContext);

    return (
        <Fragment>
            <Button
                type="button"
                theme={theme}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(evt: React.MouseEvent<HTMLButtonElement>): void =>
                    info({
                        content: evt.currentTarget.value,
                        handleClick: close,
                    })
                }
                value="Info"
            >
                Info
            </Button>{' '}
            <Button
                type="button"
                theme={theme}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(evt: React.MouseEvent<HTMLButtonElement>): void =>
                    success({
                        content: evt.currentTarget.value,
                    })
                }
                value="Success"
            >
                Success
            </Button>{' '}
            <Button
                type="button"
                theme={theme}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(evt: React.MouseEvent<HTMLButtonElement>): void =>
                    warning({
                        content: evt.currentTarget.value,
                    })
                }
                value="Warning"
            >
                Warning
            </Button>{' '}
            <Button
                type="button"
                theme={theme}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(evt: React.MouseEvent<HTMLButtonElement>): void =>
                    error({
                        content: evt.currentTarget.value,
                    })
                }
                value="Error"
            >
                Error
            </Button>{' '}
            <Button
                type="button"
                theme={theme}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={(evt: React.MouseEvent<HTMLButtonElement>): void =>
                    info({
                        actionCallback: (): void =>
                            success({
                                content: 'Callback',
                            }),
                        actionLabel: 'Coucou',
                        content: evt.currentTarget.value,
                        handleClick: close,
                    })
                }
                value="Info with callback"
            >
                Info with callback
            </Button>{' '}
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
