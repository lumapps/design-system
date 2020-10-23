import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, Emphasis, IconButton } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <>
        <Button emphasis={Emphasis.low} theme={theme}>
            Default
        </Button>

        <Button disabled emphasis={Emphasis.low} theme={theme}>
            Disabled
        </Button>

        <Button leftIcon={mdiPencil} emphasis={Emphasis.low} theme={theme}>
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} emphasis={Emphasis.low} theme={theme}>
            Dropdown
        </Button>

        <IconButton emphasis={Emphasis.low} icon={mdiPlus} theme={theme}/>
    </>
);

export default App;
