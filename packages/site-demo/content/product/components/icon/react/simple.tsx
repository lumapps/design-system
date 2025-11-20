import { mdiEmail } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Icon icon={mdiEmail} size={Size.xxs} theme={theme} />
        <Icon icon={mdiEmail} size={Size.xs} theme={theme} />
        <Icon icon={mdiEmail} size={Size.s} theme={theme} />
        <Icon icon={mdiEmail} size={Size.m} theme={theme} />
        <Icon icon={mdiEmail} size={Size.l} theme={theme} />
        <Icon icon={mdiEmail} size={Size.xl} theme={theme} />
    </>
);
