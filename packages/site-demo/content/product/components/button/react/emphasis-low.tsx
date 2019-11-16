import React from 'react';

import {
    Button,
    Emphasis,
    IconButton,
} from '@lumx/react';

import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

const App = (theme) => (
    <>
        <Button emphasis={Emphasis.low} theme={theme}>
            Default
        </Button>

        <Button
            disabled
            emphasis={Emphasis.low}
            theme={theme}
        >
            Disabled
        </Button>

        <Button
            leftIcon={mdiPencil}
            emphasis={Emphasis.low}
            theme={theme}
        >
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} emphasis={Emphasis.low} theme={theme}>
            Dropdown
        </Button>

        <IconButton emphasis={Emphasis.low} icon={mdiPlus} theme={theme} />
    </>
);

export default App;
