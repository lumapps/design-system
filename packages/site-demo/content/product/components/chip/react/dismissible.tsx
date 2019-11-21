import React from 'react';

import { Chip, Icon, Size } from '@lumx/react';
import { mdiEmail, mdiClose } from '@lumx/icons';

const App = ({ theme }) => {
    // Initialize a click handler
    const onClick = () => console.log('clicked chip');

    return (
        <>
            <Chip theme={theme} after={<Icon icon={mdiClose} size={Size.xs} />} onClick={onClick}>
                Dismissible
            </Chip>
            <Chip
                theme={theme}
                before={<Icon icon={mdiEmail} size={Size.xs} />}
                after={<Icon icon={mdiClose} size={Size.xs} />}
                onClick={onClick}
            >
                Dismissible rich
            </Chip>
        </>
    );
};

export default App;
