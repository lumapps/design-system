import { mdiEmail } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Chip theme={theme}>Default</Chip>

        <Chip before={<Icon icon={mdiEmail} size="xs" theme={theme} />} theme={theme}>
            Default rich
        </Chip>
    </>
);
