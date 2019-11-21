import React from 'react';

import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

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
