import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

export const App = ({ theme }: any) => {
    // Initialize a click handler
    const onClick = () => console.log('clicked chip');

    return (
        <>
            <Chip theme={theme} size={Size.s}>
                Small
            </Chip>

            <Chip theme={theme} size={Size.s} before={<Icon icon={mdiEmail} size={Size.xxs} theme={theme} />}>
                Small rich
            </Chip>

            <Chip
                theme={theme}
                size={Size.s}
                after={<Icon icon={mdiClose} size={Size.xxs} theme={theme} />}
                onClick={onClick}
            >
                Small dismissible
            </Chip>
        </>
    );
};
