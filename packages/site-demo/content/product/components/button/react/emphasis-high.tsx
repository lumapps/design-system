import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, IconButton } from '@lumx/react';
import React from 'react';

const App = ({ theme }: any) => (
    <>
        <Button theme={theme}>Default</Button>

        <Button disabled theme={theme}>
            Disabled
        </Button>

        <Button leftIcon={mdiPencil} theme={theme}>
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} theme={theme}>
            Dropdown
        </Button>

        <ButtonGroup>
            <Button theme={theme}>Split</Button>
            <IconButton icon={mdiMenuDown} theme={theme}/>
        </ButtonGroup>

        <IconButton icon={mdiPlus} theme={theme}/>
    </>
);

export default App;
