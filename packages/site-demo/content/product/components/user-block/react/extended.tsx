import React from 'react';

import { mdiCellphone, mdiEmail, mdiGoogleHangouts, mdiPhone, mdiSlack } from '@lumx/icons';
import { Button, Emphasis, IconButton, Orientation, Size, Theme, UserBlock } from '@lumx/react';

const App = ({ theme }: any) => {
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
        demoActions.map((demoAction) => (
            <IconButton
                key={demoAction}
                emphasis={Emphasis.low}
                color={theme === Theme.dark ? 'light' : undefined}
                icon={demoAction}
                theme={theme}
            />
        ));

    return (
        <div className="demo-grid">
            <UserBlock
                theme={theme}
                name="Emmitt O. Lum"
                fields={['Creative developer', 'Denpasar']}
                avatar="http://i.pravatar.cc/128"
                size={Size.l}
                orientation={Orientation.vertical}
                simpleAction={createSimpleAction()}
                multipleActions={createMultipleActions()}
            />
        </div>
    );
};

export default App;
