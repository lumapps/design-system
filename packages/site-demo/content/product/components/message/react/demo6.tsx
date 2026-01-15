import React from 'react';
import { Button, Message } from '@lumx/react';

export default () => {
    const [isMessageDisplayed, setMessageDisplay] = React.useState(true);

    return isMessageDisplayed ? (
        <Message
            kind="info"
            hasBackground
            closeButtonProps={{ label: 'Close', onClick: () => setMessageDisplay(false) }}
        >
            <p>
                Message text quisque tincidunt lobortis dui non auctor. Donec porta, ligula volutpat vehicula aliquet,
                dui sapien tempus felis, sed cursus diam ante.
            </p>
        </Message>
    ) : (
        <Button onClick={() => setMessageDisplay(true)}>Reset message display</Button>
    );
};
