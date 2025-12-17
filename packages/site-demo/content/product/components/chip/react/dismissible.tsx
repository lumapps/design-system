import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

export const App = ({ theme }: any) => {
    // Initialize a click handler
    const onClick = () => console.log('clicked chip');

    return (
        <>
            <Chip theme={theme} after={<Icon icon={mdiClose} size={Size.xs} theme={theme} />} onClick={onClick}>
                Dismissible
            </Chip>

            <Chip
                theme={theme}
                before={<Icon icon={mdiEmail} size={Size.xs} theme={theme} />}
                after={<Icon icon={mdiClose} size={Size.xs} theme={theme} />}
                onClick={onClick}
            >
                Dismissible rich
            </Chip>
        </>
    );
};
