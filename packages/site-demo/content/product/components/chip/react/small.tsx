import React from 'react';

import { Chip, Icon, Size } from '@lumx/react';
import { mdiEmail, mdiClose } from '@lumx/icons';

const App = ({ theme }) => {
    // Initialize a click handler
    const onClick = () => console.log('clicked chip');

    return (
        <>
            <Chip theme={theme} size={Size.s}>
                Default
            </Chip>
            <Chip theme={theme} size={Size.s} before={<Icon icon={mdiEmail} size={Size.xxs} />}>
                Rich
            </Chip>
            <Chip theme={theme} size={Size.s} after={<Icon icon={mdiClose} size={Size.xxs} />} onClick={onClick}>
                Dismissible
            </Chip>
        </>
    );
};

export default App;
