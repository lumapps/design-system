import { mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Chip theme={theme}>Default</Chip>

        <Chip before={<Icon icon={mdiEmail} size={Size.xs} theme={theme} />} theme={theme}>
            Default rich
        </Chip>
    </>
);
