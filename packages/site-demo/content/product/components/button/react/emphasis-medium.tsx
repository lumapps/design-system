import React from 'react';

import { Button, ButtonGroup, Emphasis, IconButton } from '@lumx/react';

import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

const App = ({ theme }: any) => (
    <div className="demo-grid">
        <Button emphasis={Emphasis.medium} theme={theme}>
            Default
        </Button>

        <Button isDisabled emphasis={Emphasis.medium} theme={theme}>
            Disabled
        </Button>

        <Button leftIcon={mdiPencil} emphasis={Emphasis.medium} theme={theme}>
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} emphasis={Emphasis.medium} theme={theme}>
            Dropdown
        </Button>

        <ButtonGroup>
            <Button emphasis={Emphasis.medium} theme={theme}>
                Split
            </Button>
            <IconButton emphasis={Emphasis.medium} icon={mdiMenuDown} theme={theme} />
        </ButtonGroup>

        <IconButton emphasis={Emphasis.medium} icon={mdiPlus} theme={theme} />
    </div>
);

export default App;
