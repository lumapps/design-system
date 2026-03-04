import { mdiEmail } from '@lumx/icons';
import { Icon, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Icon icon={mdiEmail} size="xxs" theme={theme} />
        <Icon icon={mdiEmail} size="xs" theme={theme} />
        <Icon icon={mdiEmail} size="s" theme={theme} />
        <Icon icon={mdiEmail} size="m" theme={theme} />
        <Icon icon={mdiEmail} size="l" theme={theme} />
        <Icon icon={mdiEmail} size="xl" theme={theme} />
    </>
);
