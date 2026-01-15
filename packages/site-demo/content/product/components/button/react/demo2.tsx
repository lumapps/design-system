import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, ButtonGroup, IconButton, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Button emphasis="medium" theme={theme}>
            Default
        </Button>

        <Button isDisabled emphasis="medium" theme={theme}>
            Disabled
        </Button>

        <Button leftIcon={mdiPencil} emphasis="medium" theme={theme}>
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} emphasis="medium" theme={theme}>
            Dropdown
        </Button>

        <ButtonGroup>
            <Button emphasis="medium" theme={theme}>
                Split
            </Button>
            <IconButton label="More" emphasis="medium" icon={mdiMenuDown} theme={theme} />
        </ButtonGroup>

        <IconButton label="Add" emphasis="medium" icon={mdiPlus} theme={theme} />
    </>
);
