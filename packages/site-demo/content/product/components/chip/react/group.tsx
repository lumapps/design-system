import React from 'react';

import { mdiClose, mdiEmail } from '@lumx/icons';
import { Chip, ChipGroup, Icon, Size } from '@lumx/react';

const App = ({ theme }) => {
    return (
        <div className="demo-grid">
            <ChipGroup>
                <Chip theme={theme} size={Size.s}>
                    Default
                </Chip>

                <Chip theme={theme} size={Size.s} before={<Icon icon={mdiEmail} size={Size.xxs} />}>
                    Rich
                </Chip>

                <Chip theme={theme} size={Size.s} after={<Icon icon={mdiClose} size={Size.xxs} />}>
                    Dismissible
                </Chip>
            </ChipGroup>
        </div>
    );
};

export default App;
