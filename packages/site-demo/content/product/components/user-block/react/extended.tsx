import React from 'react';

import { Button, ButtonEmphasis, IconButton, Orientation, Size, Theme, UserBlock } from '@lumx/react';
import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';

const App = ({ theme }) => {
    const createSimpleAction = (theme) => (
        <Button
            emphasis={ButtonEmphasis.medium}
            color={theme === Theme.dark ? 'light' : undefined}
            size={Size.s}
            theme={theme}
        >
            Follow
        </Button>
    );

    const demoActions = [mdiPhone, mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiSlack];

    const createMultipleActions = (theme) => (
        <>
            {demoActions.map((demoAction, idx) => (
                <IconButton
                    key={idx}
                    emphasis={ButtonEmphasis.low}
                    color={theme === Theme.dark ? 'light' : undefined}
                    icon={demoAction}
                    theme={theme}
                />
            ))}
        </>
    );

    return (
        <UserBlock
            theme={theme}
            name="Emmitt O. Lum"
            fields={['Creative developer', 'Denpasar']}
            avatar="http://i.pravatar.cc/128"
            size={Size.l}
            orientation={Orientation.vertical}
            onMouseEnter={() => console.log('Mouse entered')}
            onMouseLeave={() => console.log('Mouse left')}
            onClick={() => console.log('UserBlock clicked')}
            simpleAction={createSimpleAction(theme)}
            multipleActions={createMultipleActions(theme)}
        />
    );
};

export default App;
