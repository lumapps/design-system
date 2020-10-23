import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => {
    // Initialize a click handler
    // tslint:disable-next-line:no-console
    const onClick = () => console.log('clicked chip');

    return (
        <>
            <Chip theme={theme} size={Size.s}>
                Small
            </Chip>

            <Chip theme={theme} size={Size.s} before={<Icon icon={mdiEmail} size={Size.xxs}/>}>
                Small rich
            </Chip>

            <Chip theme={theme} size={Size.s} after={<Icon icon={mdiClose} size={Size.xxs}/>} onClick={onClick}>
                Small dismissible
            </Chip>
        </>
    );
};

export default App;
