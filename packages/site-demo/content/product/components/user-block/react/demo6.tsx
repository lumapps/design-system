import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, IconButton, UserBlock, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const demoActions = [
        { label: 'Copy phone number', icon: mdiPhone },
        { label: 'Copy cell phone number', icon: mdiCellphone },
        { label: 'Mail to', icon: mdiEmail },
        { label: 'Contact on google hangout', icon: mdiGoogleHangouts },
        { label: 'Contact on slack', icon: mdiSlack },
    ];
    return (
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            nameProps={{ 'aria-label': 'Emmitt O. Lum - open user profile' }}
            fields={['Creative developer', 'Denpasar']}
            avatarProps={{ image: '/demo-assets/persona.png' }}
            size="l"
            orientation="vertical"
            onClick={console.log}
            simpleAction={
                <Button emphasis="medium" color={theme === 'dark' ? 'light' : undefined} size="s" theme={theme}>
                    Follow
                </Button>
            }
            multipleActions={demoActions.map(({ icon, label }, idx) => (
                <IconButton
                    key={idx}
                    label={label}
                    emphasis="low"
                    color={theme === 'dark' ? 'light' : undefined}
                    icon={icon}
                    theme={theme}
                />
            ))}
        />
    );
};
