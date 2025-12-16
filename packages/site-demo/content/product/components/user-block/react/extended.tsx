import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, Emphasis, IconButton, Orientation, Size, Theme, UserBlock } from '@lumx/react';

export const App = ({ theme = Theme.light }: any) => {
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
            size={Size.l}
            orientation={Orientation.vertical}
            onClick={console.log}
            simpleAction={
                <Button
                    emphasis={Emphasis.medium}
                    color={theme === Theme.dark ? 'light' : undefined}
                    size={Size.s}
                    theme={theme}
                >
                    Follow
                </Button>
            }
            multipleActions={demoActions.map(({ icon, label }, idx) => (
                <IconButton
                    key={idx}
                    label={label}
                    emphasis={Emphasis.low}
                    color={theme === Theme.dark ? 'light' : undefined}
                    icon={icon}
                    theme={theme}
                />
            ))}
        />
    );
};
