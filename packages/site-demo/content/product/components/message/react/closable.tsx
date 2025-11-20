import React from 'react';

import { Message, Kind, Button } from '@lumx/react';

export const App = () => {
    const [isMessageDispayed, setMessageDisplay] = React.useState(true);

    return isMessageDispayed ? (
        <Message
            kind={Kind.info}
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
