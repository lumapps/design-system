import { mdiMenuDown, mdiPencil, mdiPlus } from '@lumx/icons';
import { Button, IconButton, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Button emphasis="low" theme={theme}>
            Default
        </Button>

        <Button isDisabled emphasis="low" theme={theme}>
            Disabled
        </Button>

        <Button leftIcon={mdiPencil} emphasis="low" theme={theme}>
            With Icon
        </Button>

        <Button rightIcon={mdiMenuDown} emphasis="low" theme={theme}>
            Dropdown
        </Button>

        <IconButton label="Add" emphasis="low" icon={mdiPlus} theme={theme} />
    </>
);
