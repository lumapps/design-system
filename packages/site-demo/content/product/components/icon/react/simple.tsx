import { mdiEmail } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';
import React from 'react';

const App = () => (
    <>
        <Icon icon={mdiEmail} size={Size.xxs}/>
        <Icon icon={mdiEmail} size={Size.xs}/>
        <Icon icon={mdiEmail} size={Size.s}/>
        <Icon icon={mdiEmail} size={Size.m}/>
        <Icon icon={mdiEmail} size={Size.l}/>
        <Icon icon={mdiEmail} size={Size.xl}/>
    </>
);

export default App;
