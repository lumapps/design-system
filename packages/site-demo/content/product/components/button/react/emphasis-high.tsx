import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, IconButton } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Button theme={theme}>Default</Button>

        <Button isDisabled theme={theme}>
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
            <IconButton label="More" icon={mdiMenuDown} theme={theme} />
        </ButtonGroup>

        <IconButton label="Add" icon={mdiPlus} theme={theme} />
    </>
);
