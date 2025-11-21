import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, Emphasis, IconButton } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
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
            <IconButton label="More" emphasis={Emphasis.medium} icon={mdiMenuDown} theme={theme} />
        </ButtonGroup>

        <IconButton label="Add" emphasis={Emphasis.medium} icon={mdiPlus} theme={theme} />
    </>
);
