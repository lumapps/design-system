import React from 'react';

import {
    Button,
    ButtonGroup,
    Emphasis,
    IconButton,
    Size,
} from '@lumx/react';

import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';

const App = (theme) => (
    <>
        <div className="demo-grid lumx-spacing-margin-bottom-big">
            <Button size={Size.s} theme={theme}>
                Default
            </Button>

            <Button disabled size={Size.s} theme={theme}>
                Disabled
            </Button>

            <Button leftIcon={mdiPencil} size={Size.s} theme={theme}>
                With Icon
            </Button>

            <Button rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button size={Size.s} theme={theme}>Split</Button>
                <IconButton size={Size.s} icon={mdiMenuDown} theme={theme}/>
            </ButtonGroup>

            <IconButton icon={mdiPlus} size={Size.s} theme={theme} />
        </div>

        <div className="demo-grid lumx-spacing-margin-bottom-big">
            <Button
                emphasis={Emphasis.medium}
                size={Size.s}
                theme={theme}
            >
                Default
            </Button>

            <Button
                disabled
                emphasis={Emphasis.medium}
                size={Size.s}
                theme={theme}
            >
                Disabled
            </Button>
            <Button
                emphasis={Emphasis.medium}
                leftIcon={mdiPencil}
                size={Size.s}
                theme={theme}
            >
                With Icon
            </Button>

            <Button emphasis={Emphasis.medium} rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <ButtonGroup>
                <Button emphasis={Emphasis.medium} size={Size.s} theme={theme}>Split</Button>
                <IconButton emphasis={Emphasis.medium} icon={mdiMenuDown} size={Size.s} theme={theme}/>
            </ButtonGroup>

            <IconButton
                icon={mdiPlus}
                emphasis={Emphasis.medium}
                size={Size.s}
                theme={theme}
            />
        </div>

        <div className="demo-grid">
            <Button
                emphasis={Emphasis.low}
                size={Size.s}
                theme={theme}
            >
                Default
            </Button>

            <Button
                disabled
                emphasis={Emphasis.low}
                size={Size.s}
                theme={theme}
            >
                Disabled
            </Button>

            <Button
                emphasis={Emphasis.low}
                leftIcon={mdiPencil}
                size={Size.s}
                theme={theme}
            >
                With Icon
            </Button>

            <Button emphasis={Emphasis.low} rightIcon={mdiMenuDown} size={Size.s} theme={theme}>
                Dropdown
            </Button>

            <IconButton
                icon={mdiPlus}
                emphasis={Emphasis.low}
                size={Size.s}
                theme={theme}
            />
        </div>
    </>
);

export default App;
