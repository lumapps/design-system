import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const onClick = () => console.log('clicked chip');
    return (
        <>
            <Chip theme={theme} after={<Icon icon={mdiClose} size="xs" theme={theme} />} onClick={onClick}>
                Dismissible
            </Chip>

            <Chip
                theme={theme}
                before={<Icon icon={mdiEmail} size="xs" theme={theme} />}
                after={<Icon icon={mdiClose} size="xs" theme={theme} />}
                onClick={onClick}
            >
                Dismissible rich
            </Chip>
        </>
    );
};
