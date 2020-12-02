import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, Emphasis, IconButton, Orientation, Size, Theme, UserBlock } from '@lumx/react';
import React from 'react';

export const App = ({ theme }: any) => {
    const createSimpleAction = () => (
        <Button
            emphasis={Emphasis.medium}
            color={theme === Theme.dark ? 'light' : undefined}
            size={Size.s}
            theme={theme}
        >
            Follow
        </Button>
    );

    const demoActions = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

    const createMultipleActions = () =>
        demoActions.map((demoAction, idx) => (
            <IconButton
                key={idx}
                label={`Action ${idx}`}
                emphasis={Emphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                icon={demoAction}
                theme={theme}
            />
        ));

    const logAction = (action: string) => () => console.log(action);

    return (
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="/demo-assets/persona.png"
            size={Size.l}
            orientation={Orientation.vertical}
            onMouseEnter={logAction('Mouse entered')}
            onMouseLeave={logAction('Mouse left')}
            onClick={logAction('UserBlock clicked')}
            simpleAction={createSimpleAction()}
            multipleActions={createMultipleActions()}
        />
    );
};
