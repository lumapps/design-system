import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    // Initialize a click handler
    // tslint:disable-next-line:no-console
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
