import React from 'react';

import { Button, ButtonGroup, IconButton } from '@lumx/react';

import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

const App = ({ theme }) => (
    <div className="demo-grid">
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
            <IconButton icon={mdiMenuDown} theme={theme} />
        </ButtonGroup>

        <IconButton icon={mdiPlus} theme={theme} />
    </div>
);

export default App;
