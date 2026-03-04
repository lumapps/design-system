import { mdiBellPlus, mdiBellRing, mdiCheck } from '@lumx/icons';
import { Button, IconButton, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Button theme={theme} emphasis="medium">
            Subscribe
        </Button>

        <Button theme={theme} emphasis="medium" leftIcon={mdiCheck} isSelected>
            Subscribed
        </Button>

        <IconButton theme={theme} label="Subscribe" emphasis="medium" icon={mdiBellPlus} />

        <IconButton theme={theme} label="Subscribed" emphasis="medium" icon={mdiBellRing} isSelected />
    </>
);
