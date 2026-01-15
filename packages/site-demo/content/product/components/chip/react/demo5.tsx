import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const onClick = () => console.log('clicked chip');
    return (
        <>
            <Chip theme={theme} size="s">
                Small
            </Chip>

            <Chip theme={theme} size="s" before={<Icon icon={mdiEmail} size="xxs" theme={theme} />}>
                Small rich
            </Chip>

            <Chip theme={theme} size="s" after={<Icon icon={mdiClose} size="xxs" theme={theme} />} onClick={onClick}>
                Small dismissible
            </Chip>
        </>
    );
};
