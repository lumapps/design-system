import React from 'react';

import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, Icon, Size } from '@lumx/react';

const App = ({ theme }: any) => {
    return (
        <div className="demo-grid">
            <Chip theme={theme} after={<Icon icon={mdiClose} size={Size.xs} />}>
                Dismissible
            </Chip>

            <Chip
                theme={theme}
                before={<Icon icon={mdiEmail} size={Size.xs} />}
                after={<Icon icon={mdiClose} size={Size.xs} />}
            >
                Dismissible rich
            </Chip>
        </div>
    );
};

export default App;
